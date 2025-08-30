import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create regular client for user operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const requestBody = await req.json();
    console.log('Received request body:', requestBody);

    const {
      firstName,
      middleName,
      lastName,
      bio,
      profilePic,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      facebook,
      instagram,
      tiktok,
      linkedin
    } = requestBody;

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    console.log('Current user ID:', user.id);

    // First, update the regular profile data
    const { data: profileResult, error: profileError } = await supabase.rpc('update_personal_profile', {
      p_first_name: firstName || null,
      p_middle_name: middleName || null,
      p_last_name: lastName || null,
      p_bio: bio || null,
      p_profile_pic: profilePic || null,
      p_phone: phone || null,
      p_address_line_1: addressLine1 || null,
      p_address_line_2: addressLine2 || null,
      p_city: city || null,
      p_state: state || null,
      p_zip_code: zipCode || null,
      p_facebook: facebook || null,
      p_instagram: instagram || null,
      p_tiktok: tiktok || null,
      p_linkedin: linkedin || null,
      p_updated_by: user.id
    });

    if (profileError) {
      console.error('Profile update error:', profileError);
      throw profileError;
    }

    console.log('Profile update result:', profileResult);

    // Handle email update separately if provided and different
    if (email && email !== user.email) {
      console.log('Updating email from', user.email, 'to', email);

      // Update email in auth.users using admin client
      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { email: email }
      );

      if (authUpdateError) {
        console.error('Auth email update error:', authUpdateError);
        throw authUpdateError;
      }

      // Update email in people_contacts
      const { data: emailResult, error: emailError } = await supabase.rpc('update_personal_email', {
        p_email: email,
        p_updated_by: user.id
      });

      if (emailError) {
        console.error('Email update error:', emailError);
        throw emailError;
      }

      console.log('Email update result:', emailResult);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Profile updated successfully',
        profileResult,
        emailUpdated: email && email !== user.email
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in update-personal-profile function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});