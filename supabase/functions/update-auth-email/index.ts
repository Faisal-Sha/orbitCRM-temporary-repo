import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UpdateAuthEmailRequest {
  auth_user_id: string;
  new_email: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { auth_user_id, new_email }: UpdateAuthEmailRequest = await req.json();

    console.log('Update auth email request:', { auth_user_id, new_email });

    // Validate inputs
    if (!auth_user_id || !new_email) {
      console.error('Missing required fields:', { auth_user_id, new_email });
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required fields: auth_user_id and new_email' 
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

    // Initialize Supabase client with user token for authentication check
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
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

    // Create admin client to update auth.users
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Update the user's email in auth.users
    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      auth_user_id,
      { email: new_email }
    );

    if (updateError) {
      console.error('Failed to update auth.users email:', updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Failed to update authentication email: ${updateError.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Successfully updated auth.users email:', updatedUser);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Authentication email updated successfully',
        user: updatedUser
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in update-auth-email function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});