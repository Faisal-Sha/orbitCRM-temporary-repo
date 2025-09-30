import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get user from request
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get Cal.com credentials from environment
    const calClientId = Deno.env.get('CAL_OAUTH_CLIENT_ID')
    const calClientSecret = Deno.env.get('CAL_OAUTH_CLIENT_SECRET')
    const calApiUrl = Deno.env.get('CAL_API_URL') || 'https://api.cal.com/v2'

    if (!calClientId || !calClientSecret) {
      return new Response(JSON.stringify({ error: 'Cal.com credentials not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get existing Cal user from database
    const { data: calUser, error: dbError } = await supabaseClient
      .from('cal_atoms_users')
      .select('*')
      .eq('orbit_user_id', user.id)
      .single()

    if (dbError || !calUser) {
      return new Response(JSON.stringify({ error: 'Cal user not found in database' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get access token for Cal.com API
    const tokenResponse = await fetch(`${calApiUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: calClientId,
        client_secret: calClientSecret,
      }),
    })

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.json()
      return new Response(JSON.stringify({ error: 'Failed to get Cal.com access token', details: tokenError }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const tokenData = await tokenResponse.json()

    // Delete the managed user from Cal.com
    const deleteResponse = await fetch(`${calApiUrl}/managed-users/${calUser.cal_user_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!deleteResponse.ok) {
      const deleteError = await deleteResponse.json()
      console.error('Cal.com delete error:', deleteError)
      
      // If user not found (404), consider it successful
      if (deleteResponse.status !== 404) {
        return new Response(JSON.stringify({ error: 'Failed to delete Cal.com user', details: deleteError }), {
          status: deleteResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // Delete from our database
    const { error: deleteDbError } = await supabaseClient
      .from('cal_atoms_users')
      .delete()
      .eq('orbit_user_id', user.id)

    if (deleteDbError) {
      return new Response(JSON.stringify({ error: 'Failed to delete from database', details: deleteDbError }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Cal.com user deleted successfully',
      deletedCalUserId: calUser.cal_user_id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
