import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PersonData {
  id: string;
  first_name: string;
  last_name: string;
  people_contacts: Array<{
    email: string;
    phone: string | null;
    country: string;
  }>;
  app_agencies_people: Array<{
    agency: {
      agency_name: string | null;
      agency_state: string | null;
    } | null;
  }>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let person_id: string | undefined;

  try {
    const body = await req.json();
    person_id = body.person_id;
    const sync_type = body.sync_type || 'application'; // 'application', 'appointment', or 'client_active'
    
    console.log('Edge function invoked with:', { person_id, sync_type, body });
    
    if (!person_id) {
      console.error('No person_id provided in request');
      return new Response(
        JSON.stringify({ success: false, error: 'person_id required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log('Starting MailerLite sync for person:', person_id);

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch MailerLite API configuration
    const { data: integration, error: integrationError } = await supabase
      .from('settings_integrations_external')
      .select('configuration')
      .eq('service_provider', 'MailerLite')
      .eq('is_deleted', false)
      .single();

    if (integrationError || !integration) {
      console.error('MailerLite integration not configured:', integrationError);
      
      // Log failure to database
      await supabase
        .from('mailerlite_sync_log')
        .update({ sync_status: 'error', error_message: 'MailerLite integration not configured' })
        .eq('person_id', person_id)
        .eq('sync_status', 'pending');
      
      return new Response(
        JSON.stringify({ success: false, error: 'MailerLite not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const apiKey = integration.configuration?.apiKey;
    const groupIdApplication = integration.configuration?.groupIdLeadApplication;
    const groupIdAppointment = integration.configuration?.groupIdLeadAppointment;
    const groupIdClientActive = integration.configuration?.groupIdClientActive;
    
    // Select appropriate group ID based on sync_type
    const groupId = sync_type === 'appointment' 
      ? groupIdAppointment 
      : sync_type === 'client_active'
      ? groupIdClientActive
      : groupIdApplication;

  console.log('MailerLite config found:', { 
    hasApiKey: !!apiKey, 
    sync_type,
    groupIdApplication,
    groupIdAppointment,
    groupIdClientActive,
    groupIdClientDischarged,
    selectedGroupId: groupId 
  });

    if (!apiKey) {
      console.error('MailerLite API key not found in configuration');
      
      // Log failure to database
      await supabase
        .from('mailerlite_sync_log')
        .update({ sync_status: 'error', error_message: 'MailerLite API key missing from configuration' })
        .eq('person_id', person_id)
        .eq('sync_status', 'pending');
      
      return new Response(
        JSON.stringify({ success: false, error: 'MailerLite API key missing' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (!groupId) {
      console.warn(`MailerLite Group ID not configured for sync_type '${sync_type}' - subscriber will not be added to any group`);
    }

    // Fetch person basic data
    const { data: personData, error: personError } = await supabase
      .from('people')
      .select('id, first_name, last_name')
      .eq('id', person_id)
      .eq('is_deleted', false)
      .maybeSingle();

    if (personError || !personData) {
      console.error('Failed to fetch person data:', personError);
      
      // Log failure to database
      await supabase
        .from('mailerlite_sync_log')
        .update({ sync_status: 'error', error_message: `Person not found: ${personError?.message}` })
        .eq('person_id', person_id)
        .eq('sync_status', 'pending');
      
      return new Response(
        JSON.stringify({ success: false, error: 'Person not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Fetch primary contact (latest)
    const { data: contact, error: contactError } = await supabase
      .from('people_contacts')
      .select('email, phone, country')
      .eq('person_id', person_id)
      .eq('is_deleted', false)
      .order('updated_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();

    if (contactError || !contact || !contact.email) {
      console.error('No email found for person or contact fetch error:', contactError);
      
      // Log failure to database
      await supabase
        .from('mailerlite_sync_log')
        .update({ sync_status: 'error', error_message: 'No email found for person' })
        .eq('person_id', person_id)
        .eq('sync_status', 'pending');
      
      return new Response(
        JSON.stringify({ success: false, error: 'Email required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Fetch agency info
    const { data: apRow } = await supabase
      .from('app_agencies_people')
      .select('agency_id')
      .eq('person_id', person_id)
      .eq('is_deleted', false)
      .limit(1)
      .maybeSingle();

    let agency: { agency_name: string | null; agency_state: string | null } | null = null;
    if (apRow?.agency_id) {
      const { data: agencyRow } = await supabase
        .from('app_agencies')
        .select('agency_name, agency_state')
        .eq('id', apRow.agency_id)
        .maybeSingle();
      if (agencyRow) {
        agency = { agency_name: agencyRow.agency_name ?? null, agency_state: agencyRow.agency_state ?? null };
      }
    }

    // Prepare MailerLite subscriber data
    const subscriberData = {
      email: contact.email,
      fields: {
        personid: personData.id,
        name: personData.first_name,
        last_name: personData.last_name,
        phone: contact.phone || '',
        country: contact.country || 'USA',
        agency_name: agency?.agency_name || '',
        agency_state: agency?.agency_state || '',
      },
      status: 'active',
      ...(groupId && { groups: [groupId] }),
    };

    console.log('Sending to MailerLite:', subscriberData.email);

    // Call MailerLite API
    const mailerLiteResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(subscriberData),
    });

    const responseText = await mailerLiteResponse.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (!mailerLiteResponse.ok) {
      console.error('MailerLite API error:', mailerLiteResponse.status, responseData);
      
      // Log failure to database
      await supabase
        .from('mailerlite_sync_log')
        .update({ 
          sync_status: 'error', 
          error_message: `MailerLite API error: ${mailerLiteResponse.status} - ${JSON.stringify(responseData)}` 
        })
        .eq('person_id', person_id)
        .eq('sync_status', 'pending');
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'MailerLite API error',
          details: responseData 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log('Successfully synced to MailerLite:', responseData);

    // Log success to database
    await supabase
      .from('mailerlite_sync_log')
      .update({ 
        sync_status: 'success', 
        error_message: `Successfully synced to MailerLite (${sync_type})${groupId ? ` in group ${groupId}` : ''}: ${responseData.data?.id || 'subscriber created'}` 
      })
      .eq('person_id', person_id)
      .eq('sync_status', 'pending')
      .eq('sync_type', sync_type);

    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error in sync-mailerlite-lead:', error);
    
    // Log failure to database if we have person_id
    if (person_id) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        await supabase
          .from('mailerlite_sync_log')
          .update({ 
            sync_status: 'error', 
            error_message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}` 
          })
          .eq('person_id', person_id)
          .eq('sync_status', 'pending');
      } catch (logError) {
        console.error('Failed to log error to database:', logError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
