import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const { person_id, since } = await req.json();

    if (!person_id) {
      return new Response(JSON.stringify({ error: 'person_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Starting service assignment backfill for person:', person_id);
    if (since) {
      console.log('Filtering submissions since:', since);
    }

    // Get all form submissions for this person
    let query = supabase
      .from('forms_submissions')
      .select('id, submission_data, agency_id, created_at')
      .eq('submitted_by_id', person_id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (since) {
      query = query.gte('created_at', since);
    }

    const { data: submissions, error: submissionsError } = await query;

    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      throw submissionsError;
    }

    console.log(`Found ${submissions?.length || 0} submissions to process`);

    let assignmentsCreated = 0;
    let assignmentsSkipped = 0;
    const results = [];

    for (const submission of submissions || []) {
      console.log('Processing submission:', submission.id);

      const submissionData = submission.submission_data;

      // Extract service value(s)
      const rawService = 
        submissionData.service ||
        submissionData.Service ||
        submissionData.services ||
        submissionData.Services ||
        Object.entries(submissionData).find(([key]) => 
          key.toLowerCase().includes('service')
        )?.[1];

      if (!rawService) {
        console.log('No service field in submission:', submission.id);
        results.push({ submission_id: submission.id, status: 'no_service_data' });
        continue;
      }

      // Normalize to array
      const serviceNames = (Array.isArray(rawService) ? rawService : [rawService])
        .map(s => String(s).trim())
        .filter(Boolean);

      console.log('Found service(s):', serviceNames);

      for (const serviceName of serviceNames) {
        // Try exact match first
        let { data: serviceRecord, error: serviceError } = await supabase
          .from('settings_services_and_fees')
          .select('id, service')
          .eq('agency_id', submission.agency_id)
          .ilike('service', serviceName)
          .eq('is_deleted', false)
          .maybeSingle();

        // Fallback to contains match
        if (!serviceRecord && !serviceError) {
          const { data: containsMatch } = await supabase
            .from('settings_services_and_fees')
            .select('id, service')
            .eq('agency_id', submission.agency_id)
            .ilike('service', `%${serviceName}%`)
            .eq('is_deleted', false)
            .maybeSingle();
          serviceRecord = containsMatch;
        }

        if (!serviceRecord) {
          console.warn('Service not found in database:', serviceName);
          results.push({ 
            submission_id: submission.id, 
            service_name: serviceName,
            status: 'service_not_found' 
          });
          continue;
        }

        // Check if already assigned
        const { data: existingAssignment } = await supabase
          .from('people_assign_service')
          .select('id')
          .eq('person_id', person_id)
          .eq('service_id', serviceRecord.id)
          .eq('is_deleted', false)
          .maybeSingle();

        if (existingAssignment) {
          console.log('Already assigned:', serviceRecord.service);
          assignmentsSkipped++;
          results.push({
            submission_id: submission.id,
            service_name: serviceRecord.service,
            status: 'already_assigned'
          });
          continue;
        }

        // Create assignment
        const { error: assignError } = await supabase
          .from('people_assign_service')
          .insert({
            person_id: person_id,
            service_id: serviceRecord.id,
            created_by: person_id,
            updated_by: person_id
          });

        if (assignError) {
          console.error('Error assigning service:', assignError);
          results.push({
            submission_id: submission.id,
            service_name: serviceRecord.service,
            status: 'error',
            error: assignError.message
          });
        } else {
          console.log('✓ Assigned service:', serviceRecord.service);
          assignmentsCreated++;
          results.push({
            submission_id: submission.id,
            service_name: serviceRecord.service,
            service_id: serviceRecord.id,
            status: 'created'
          });
        }
      }
    }

    const summary = {
      person_id,
      submissions_processed: submissions?.length || 0,
      assignments_created: assignmentsCreated,
      assignments_skipped: assignmentsSkipped,
      results
    };

    console.log('Backfill complete:', summary);

    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Backfill error:', error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
