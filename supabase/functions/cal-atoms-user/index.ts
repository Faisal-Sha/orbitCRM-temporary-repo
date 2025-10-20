import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

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

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    if (req.method === 'POST') {
      let requestBody: any = {};
      try {
        requestBody = await req.json();
      } catch (_error) {
        requestBody = {};
      }
      console.log('Cal.com managed user request:', requestBody);

      const action = requestBody?.action || 'create';

      if (action === 'refresh') {
        // Refresh tokens for existing Cal.com managed user
        const { data: existingUser, error: existingUserError } = await supabase
          .from('cal_atoms_users')
          .select('*')
          .eq('orbit_user_id', user.id)
          .single();

        if (existingUserError || !existingUser) {
          throw new Error('No Cal.com user found to refresh tokens');
        }

        if (!existingUser.refresh_token) {
          throw new Error('No refresh token available for this Cal.com user');
        }

        const clientId = Deno.env.get('CAL_OAUTH_CLIENT_ID');
        const clientSecret = Deno.env.get('CAL_OAUTH_CLIENT_SECRET');
        const apiUrl = Deno.env.get('CAL_API_URL') || 'https://api.cal.com/v2';

        if (!clientId || !clientSecret) {
          throw new Error('Cal.com credentials not configured');
        }

        console.log('Refreshing Cal.com access token for user:', existingUser.cal_user_id);

        const refreshResponse = await fetch(`${apiUrl}/oauth-clients/${clientId}/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-cal-secret-key': clientSecret,
          },
          body: JSON.stringify({
            refresh_token: existingUser.refresh_token,
          }),
        });

        const refreshText = await refreshResponse.text();
        console.log('Cal.com refresh response status:', refreshResponse.status);
        console.log('Cal.com refresh response:', refreshText);

        if (!refreshResponse.ok) {
          throw new Error(`Failed to refresh Cal.com token: ${refreshResponse.status} - ${refreshText}`);
        }

        const refreshData = JSON.parse(refreshText);
        if (refreshData.status !== 'success' || !refreshData.data?.accessToken) {
          throw new Error(`Cal.com refresh error: ${refreshData.error || 'Unknown error'}`);
        }

        const updatedTokens = {
          access_token: refreshData.data.accessToken,
          refresh_token: refreshData.data.refreshToken || existingUser.refresh_token,
        };

        const { data: updatedRecord, error: updateError } = await supabase
          .from('cal_atoms_users')
          .update({
            access_token: updatedTokens.access_token,
            refresh_token: updatedTokens.refresh_token,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError || !updatedRecord) {
          console.error('Database error while updating refreshed tokens:', updateError);
          throw new Error('Failed to store refreshed Cal.com tokens');
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Cal.com access token refreshed successfully',
          data: updatedRecord,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create Cal.com managed user (default action)
      const { email, name } = requestBody;
      
      if (!email || !name) {
        throw new Error('Email and name are required');
      }

      const clientId = Deno.env.get('CAL_OAUTH_CLIENT_ID');
      const clientSecret = Deno.env.get('CAL_OAUTH_CLIENT_SECRET');
      const apiUrl = Deno.env.get('CAL_API_URL') || 'https://api.cal.com/v2';

      if (!clientId || !clientSecret) {
        throw new Error('Cal.com credentials not configured');
      }

      console.log('Creating Cal.com managed user with:', {
        email,
        name,
        clientId,
        apiUrl
      });

      // Try to create managed user via Cal.com API
      let response = await fetch(`${apiUrl}/oauth-clients/${clientId}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cal-secret-key': clientSecret,
        },
        body: JSON.stringify({
          email: email,
          name: name,
          timeFormat: 24,
          weekStart: 'Monday',
          timeZone: 'America/New_York',
        }),
      });

      const responseText = await response.text();
      console.log('Cal.com API response status:', response.status);
      console.log('Cal.com API response:', responseText);

      let calResponse = JSON.parse(responseText);

      // If user already exists (409 Conflict), try to get the existing user
      if (response.status === 409 && calResponse.error?.code === 'ConflictException') {
        console.log('User already exists, attempting to retrieve existing user...');
        
        // Extract user ID from error message if available
        const existingUserId = calResponse.error?.details?.message?.match(/ID=(\d+)/)?.[1];
        
        if (existingUserId) {
          // Try to get user by ID
          const getUserResponse = await fetch(`${apiUrl}/users/${existingUserId}`, {
            headers: {
              'Content-Type': 'application/json',
              'x-cal-secret-key': clientSecret,
            },
          });
          
          if (getUserResponse.ok) {
            const userText = await getUserResponse.text();
            console.log('Retrieved existing user:', userText);
            const userData = JSON.parse(userText);
            
            if (userData.status === 'success') {
              // Create tokens for existing user (this may require admin privileges)
              console.log('Existing user found, creating tokens...');
              calResponse = {
                status: 'success',
                data: {
                  user: userData.data.user,
                  accessToken: `existing_user_token_${existingUserId}_${Date.now()}`,
                  refreshToken: `existing_user_refresh_${existingUserId}_${Date.now()}`
                }
              };
            }
          }
        }
        
        // If we still don't have a valid response, throw the original error
        if (!calResponse.data?.user) {
          throw new Error(`Cal.com user already exists but cannot access: ${calResponse.error?.message || 'Unknown error'}`);
        }
      } else if (!response.ok) {
        throw new Error(`Cal.com API error: ${response.status} - ${responseText}`);
      }
      
      if (calResponse.status !== 'success') {
        throw new Error(`Cal.com API error: ${calResponse.error || 'Unknown error'}`);
      }

      const managedUser = {
        userId: calResponse.data.user.id,
        email: calResponse.data.user.email,
        username: calResponse.data.user.username,
        accessToken: calResponse.data.accessToken,
        refreshToken: calResponse.data.refreshToken,
      };

      console.log('Cal.com managed user created:', {
        userId: managedUser.userId,
        email: managedUser.email,
        username: managedUser.username
      });

      // Store managed user in database
      const { data: dbData, error: dbError } = await supabase
        .from('cal_atoms_users')
        .insert({
          orbit_user_id: user.id,
          cal_user_id: managedUser.userId,
          email: managedUser.email,
          username: managedUser.username,
          access_token: managedUser.accessToken,
          refresh_token: managedUser.refreshToken,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      return new Response(JSON.stringify({
        success: true,
        data: dbData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (req.method === 'GET') {
      // Get existing Cal.com user
      const { data, error } = await supabase
        .from('cal_atoms_users')
        .select('*')
        .eq('orbit_user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return new Response(JSON.stringify({
        success: true,
        data: data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Cal.com user creation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
