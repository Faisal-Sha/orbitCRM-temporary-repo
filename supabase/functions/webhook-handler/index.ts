import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Webhook processors for different types
const webhookProcessors = {
  form_submission: processFormSubmission,
  crm_data: processCrmData,
  payment_notification: processPaymentNotification,
  lead_capture: processLeadCapture,
  custom: processCustomData
};

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

    if (!webhookId || webhookId === 'webhook-handler') {
      return new Response(JSON.stringify({ error: 'Webhook ID required in URL path' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Webhook handler received request for ID:', webhookId);

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
      const isValidSignature = await verifySignature(body, webhook.webhook_api_secret, signature);
      if (!isValidSignature) {
        console.error('Invalid webhook signature');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Parse webhook data
    let webhookData;
    try {
      webhookData = JSON.parse(body);
    } catch (parseError) {
      console.error('Invalid JSON in request body:', parseError);
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process webhook based on type
    const processor = webhookProcessors[webhook.webhook_type as keyof typeof webhookProcessors];
    if (!processor) {
      console.error('Unknown webhook type:', webhook.webhook_type);
      return new Response(JSON.stringify({ error: 'Unknown webhook type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await processor(supabase, webhook, webhookData);
    
    console.log('Webhook processed successfully:', result.id);

    return new Response(JSON.stringify({ 
      success: true, 
      ...result,
      message: `${webhook.webhook_type} processed successfully`
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

async function verifySignature(body: string, secret: string, signature: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const expectedHex = 'sha256=' + Array.from(new Uint8Array(expectedSignature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return signature === expectedHex;
}

async function processFormSubmission(supabase: any, webhook: any, data: any) {
  const formId = data.form_id || data.formId || 'unknown';
  const subTrackId = data.sub_track_id || data.subTrackId || crypto.randomUUID();

  // Find or create a person based on email if available
  let submittedById = null;
  const email = data.email || data.Email || data.user_email;
  
  if (email) {
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
  const { data: submission, error } = await supabase
    .from('forms_submissions')
    .insert({
      agency_id: webhook.agency_id,
      form_id: formId,
      sub_track_id: subTrackId,
      submission_data: data,
      submitted_by_id: submittedById,
      submission_status: 'active'
    })
    .select()
    .single();

  if (error) throw error;
  return { id: submission.id, type: 'form_submission' };
}

async function processCrmData(supabase: any, webhook: any, data: any) {
  // Process CRM contact/lead data
  const contactData = {
    first_name: data.first_name || data.firstName || data.name?.split(' ')[0],
    last_name: data.last_name || data.lastName || data.name?.split(' ')[1],
    email: data.email || data.Email,
    phone: data.phone || data.Phone || data.mobile,
    status: data.status || 'active'
  };

  // Create person record
  const { data: person, error: personError } = await supabase
    .from('people')
    .insert({
      first_name: contactData.first_name,
      last_name: contactData.last_name,
      status: contactData.status,
      user_role_id: (await supabase.from('app_user_roles').select('id').eq('role_name', 'lead').single()).data?.id
    })
    .select()
    .single();

  if (personError) throw personError;

  // Create contact record
  if (contactData.email) {
    await supabase.from('people_contacts').insert({
      person_id: person.id,
      email: contactData.email,
      phone: contactData.phone
    });
  }

  return { id: person.id, type: 'crm_data' };
}

async function processPaymentNotification(supabase: any, webhook: any, data: any) {
  // Store payment notification data
  const { data: paymentRecord, error } = await supabase
    .from('forms_submissions') // Using forms_submissions as generic storage for now
    .insert({
      agency_id: webhook.agency_id,
      form_id: 'payment_notification',
      submission_data: data,
      submission_status: 'active'
    })
    .select()
    .single();

  if (error) throw error;
  return { id: paymentRecord.id, type: 'payment_notification' };
}

async function processLeadCapture(supabase: any, webhook: any, data: any) {
  // Process lead capture similar to CRM data but with lead-specific handling
  const leadData = {
    first_name: data.first_name || data.firstName || data.name?.split(' ')[0],
    last_name: data.last_name || data.lastName || data.name?.split(' ')[1] || '',
    email: data.email || data.Email,
    phone: data.phone || data.Phone || data.mobile,
    source: data.source || 'webhook_capture'
  };

  // Create person with lead role
  const { data: leadRole } = await supabase
    .from('app_user_roles')
    .select('id')
    .eq('role_name', 'lead')
    .single();

  const { data: person, error: personError } = await supabase
    .from('people')
    .insert({
      first_name: leadData.first_name,
      last_name: leadData.last_name,
      status: 'active',
      user_role_id: leadRole?.id
    })
    .select()
    .single();

  if (personError) throw personError;

  // Create contact record
  if (leadData.email) {
    await supabase.from('people_contacts').insert({
      person_id: person.id,
      email: leadData.email,
      phone: leadData.phone
    });
  }

  return { id: person.id, type: 'lead_capture' };
}

async function processCustomData(supabase: any, webhook: any, data: any) {
  // Store custom webhook data generically
  const { data: customRecord, error } = await supabase
    .from('forms_submissions') // Using forms_submissions as generic storage
    .insert({
      agency_id: webhook.agency_id,
      form_id: 'custom_webhook',
      submission_data: data,
      submission_status: 'active'
    })
    .select()
    .single();

  if (error) throw error;
  return { id: customRecord.id, type: 'custom' };
}