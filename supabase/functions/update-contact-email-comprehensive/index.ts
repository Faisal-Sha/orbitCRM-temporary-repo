import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UpdateEmailRequest {
  person_id: string;
  new_email: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { person_id, new_email }: UpdateEmailRequest = await req.json();

    console.log('Starting comprehensive email update for person:', person_id, 'new email:', new_email);

    // Validate inputs
    if (!person_id || !new_email) {
      console.error('Missing required fields:', { person_id, new_email });
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required fields: person_id and new_email' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(new_email)) {
      console.error('Invalid email format:', new_email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid email format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get authentication token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing Authorization header' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Authentication failed:', userError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Authentication failed' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Authenticated user:', user.id);

    // Check for email conflicts (excluding current person)
    const { data: existingContact, error: conflictError } = await supabaseAdmin
      .from('people_contacts')
      .select('person_id, people!inner(id, is_deleted)')
      .eq('email', new_email)
      .neq('person_id', person_id)
      .eq('is_deleted', false)
      .eq('people.is_deleted', false)
      .maybeSingle();

    if (conflictError) {
      console.error('Error checking email conflicts:', conflictError);
      throw new Error('Failed to validate email uniqueness');
    }

    if (existingContact) {
      console.error('Email conflict found:', existingContact);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Email already exists for another person' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get person and linked user info
    const { data: personData, error: personError } = await supabaseAdmin
      .from('people')
      .select(`
        id,
        user_account_id,
        app_users(id, user_id)
      `)
      .eq('id', person_id)
      .eq('is_deleted', false)
      .single();

    if (personError) {
      console.error('Error fetching person data:', personError);
      throw new Error('Person not found or access denied');
    }

    console.log('Person data retrieved:', { 
      person_id: personData.id, 
      has_user_account: !!personData.user_account_id,
      app_users: personData.app_users 
    });

    // Update people_contacts table
    console.log('Updating people_contacts table...');
    const { data: existingContactRecord, error: fetchContactError } = await supabaseAdmin
      .from('people_contacts')
      .select('id')
      .eq('person_id', person_id)
      .eq('is_deleted', false)
      .maybeSingle();

    if (fetchContactError) {
      console.error('Error fetching contact record:', fetchContactError);
      throw new Error('Failed to fetch contact record');
    }

    if (existingContactRecord) {
      // Update existing contact record
      const { error: updateContactError } = await supabaseAdmin
        .from('people_contacts')
        .update({
          email: new_email,
          updated_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingContactRecord.id);

      if (updateContactError) {
        console.error('Error updating contact record:', updateContactError);
        throw new Error('Failed to update contact information');
      }
    } else {
      // Create new contact record
      const { error: insertContactError } = await supabaseAdmin
        .from('people_contacts')
        .insert({
          person_id: person_id,
          email: new_email,
          created_by: user.id,
          updated_by: user.id
        });

      if (insertContactError) {
        console.error('Error creating contact record:', insertContactError);
        throw new Error('Failed to create contact information');
      }
    }

    console.log('people_contacts updated successfully');

    // Update app_users and auth.users if person is linked to a user account
    if (personData.user_account_id && personData.app_users) {
      console.log('Updating app_users table...');
      const { error: appUserError } = await supabaseAdmin
        .from('app_users')
        .update({
          account_email: new_email,
          updated_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', personData.user_account_id);

      if (appUserError) {
        console.error('Error updating app_users:', appUserError);
        throw new Error('Failed to update app user information');
      }

      console.log('app_users updated successfully');

      // Update auth.users
      console.log('Updating auth.users table...');
      const { data: updatedAuthUser, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        personData.app_users[0].user_id,
        { email: new_email }
      );

      if (authError) {
        console.error('Error updating auth.users:', authError);
        throw new Error(`Failed to update authentication email: ${authError.message}`);
      }

      console.log('auth.users updated successfully:', updatedAuthUser);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email updated successfully across all systems (people_contacts, app_users, and auth.users)',
          updated_tables: ['people_contacts', 'app_users', 'auth.users']
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.log('Person not linked to user account, only people_contacts updated');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email updated successfully in contact information',
          updated_tables: ['people_contacts']
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Comprehensive email update failed:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: (error as any)?.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});