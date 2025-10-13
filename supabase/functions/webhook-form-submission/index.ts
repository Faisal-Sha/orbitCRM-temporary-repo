import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get webhook ID from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const webhookId = pathParts[pathParts.length - 1];

    if (!webhookId || webhookId === 'webhook-form-submission') {
      return new Response(JSON.stringify({ error: 'Webhook ID required in URL path' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Webhook submission received for ID:', webhookId);

    // Get webhook configuration
    const { data: webhook, error: webhookError } = await supabase
      .from('settings_integrations_webhooks')
      .select('*')
      .eq('id', webhookId)
      .eq('status', 'active')
      .single();

    if (webhookError || !webhook) {
      console.error('Webhook not found or inactive:', webhookError);
      return new Response(JSON.stringify({ error: 'Webhook not found or inactive' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify webhook signature if secret is provided
    const signature = req.headers.get('x-webhook-signature') || req.headers.get('x-hub-signature-256');
    const body = await req.text();
    
    if (webhook.webhook_api_secret && signature) {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(webhook.webhook_api_secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
      const expectedHex = 'sha256=' + Array.from(new Uint8Array(expectedSignature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      if (signature !== expectedHex) {
        console.error('Invalid webhook signature');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Parse submission data
    let submissionData;
    try {
      submissionData = JSON.parse(body);
    } catch (parseError) {
      console.error('Invalid JSON in request body:', parseError);
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract form metadata
    const formId = submissionData.form_id || submissionData.formId || 'unknown';
    const subTrackId = submissionData.sub_track_id || submissionData.subTrackId || crypto.randomUUID();

    // Find or create a person based on email if available
    let submittedById = null;
    const email = submissionData.email || submissionData.Email || submissionData.user_email;
    
    if (email) {
      // Look for existing person with this email in the same agency
      const { data: existingContact } = await supabase
        .from('people_contacts')
        .select(`
          person_id,
          people!inner(
            id,
            app_agencies_people!inner(agency_id)
          )
        `)
        .eq('email', email)
        .eq('people.app_agencies_people.agency_id', webhook.agency_id)
        .eq('is_deleted', false)
        .single();

      if (existingContact?.person_id) {
        submittedById = existingContact.person_id;
      }
    }

    // Store form submission
    const { data: submission, error: submissionError } = await supabase
      .from('forms_submissions')
      .insert({
        agency_id: webhook.agency_id,
        form_id: formId,
        sub_track_id: subTrackId,
        submission_data: submissionData,
        submitted_by_id: submittedById,
        submission_status: 'active'
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Error storing submission:', submissionError);
      return new Response(JSON.stringify({ error: 'Failed to store submission' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Form submission stored successfully:', submission.id);

    // Check for service data and assign service if found
    if (submittedById && submissionData.service) {
      console.log('Service found in submission:', submissionData.service);
      
      try {
        // Look up service by name in the same agency
        const { data: serviceRecord, error: serviceError } = await supabase
          .from('settings_services_and_fees')
          .select('id')
          .eq('agency_id', webhook.agency_id)
          .ilike('service', submissionData.service)
          .eq('is_deleted', false)
          .maybeSingle();

        if (serviceError) {
          console.error('Error looking up service:', serviceError);
        } else if (serviceRecord) {
          console.log('Found service record:', serviceRecord.id);
          
          // Check if service assignment already exists
          const { data: existingAssignment } = await supabase
            .from('people_assign_service')
            .select('id')
            .eq('person_id', submittedById)
            .eq('service_id', serviceRecord.id)
            .eq('is_deleted', false)
            .maybeSingle();

          if (!existingAssignment) {
            // Create new service assignment
            const { error: assignError } = await supabase
              .from('people_assign_service')
              .insert({
                person_id: submittedById,
                service_id: serviceRecord.id,
                created_by: submittedById,
                updated_by: submittedById
              });

            if (assignError) {
              console.error('Error assigning service:', assignError);
            } else {
              console.log('Service assigned successfully to person:', submittedById);
            }
          } else {
            console.log('Service already assigned to this person');
          }
        } else {
          console.warn('Service not found in database:', submissionData.service);
        }
      } catch (serviceAssignError) {
        console.error('Error in service assignment process:', serviceAssignError);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      submission_id: submission.id,
      message: 'Form submission received successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});