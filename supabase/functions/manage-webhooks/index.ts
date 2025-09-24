import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's agency ID
    const { data: agencyData } = await supabase.rpc('current_user_agency_id');
    
    if (!agencyData) {
      return new Response(JSON.stringify({ error: 'No agency access' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const agencyId = agencyData;
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const webhookId = pathParts[pathParts.length - 1];

    switch (req.method) {
      case 'GET':
        if (webhookId && webhookId !== 'manage-webhooks') {
          // Get single webhook
          const { data: webhook, error } = await supabase
            .from('settings_integrations_webhooks')
            .select('*')
            .eq('id', webhookId)
            .eq('agency_id', agencyId)
            .single();

          if (error) {
            return new Response(JSON.stringify({ error: 'Webhook not found' }), {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(webhook), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // Get all webhooks for agency
          const { data: webhooks, error } = await supabase
            .from('settings_integrations_webhooks')
            .select('*')
            .eq('agency_id', agencyId)
            .order('created_at', { ascending: false });

          if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(webhooks || []), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        const createData = await req.json();
        const webhookSecret = createData.webhook_api_secret || crypto.randomUUID();
        
        const { data: newWebhook, error: createError } = await supabase
          .from('settings_integrations_webhooks')
          .insert({
            agency_id: agencyId,
            webhook_name: createData.webhook_name,
            webhook_api_secret: webhookSecret,
            status: createData.status || 'active',
            created_by: user.id,
            updated_by: user.id
          })
          .select()
          .single();

        if (createError) {
          return new Response(JSON.stringify({ error: createError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Generate the webhook endpoint URL
        const baseUrl = Deno.env.get('SUPABASE_URL')!.replace('/rest/v1', '');
        const webhookUrl = `${baseUrl}/functions/v1/webhook-form-submission/${newWebhook.id}`;
        
        // Update with the generated endpoint
        const { data: updatedWebhook, error: updateError } = await supabase
          .from('settings_integrations_webhooks')
          .update({ webhook_api_endpoint: webhookUrl })
          .eq('id', newWebhook.id)
          .select()
          .single();

        if (updateError) {
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(updatedWebhook), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        if (!webhookId || webhookId === 'manage-webhooks') {
          return new Response(JSON.stringify({ error: 'Webhook ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const updateData = await req.json();
        const { data: updatedWebhookPut, error: putError } = await supabase
          .from('settings_integrations_webhooks')
          .update({
            webhook_name: updateData.webhook_name,
            webhook_api_secret: updateData.webhook_api_secret,
            status: updateData.status,
            updated_by: user.id
          })
          .eq('id', webhookId)
          .eq('agency_id', agencyId)
          .select()
          .single();

        if (putError) {
          return new Response(JSON.stringify({ error: putError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(updatedWebhookPut), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'DELETE':
        if (!webhookId || webhookId === 'manage-webhooks') {
          return new Response(JSON.stringify({ error: 'Webhook ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error: deleteError } = await supabase
          .from('settings_integrations_webhooks')
          .delete()
          .eq('id', webhookId)
          .eq('agency_id', agencyId);

        if (deleteError) {
          return new Response(JSON.stringify({ error: deleteError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('Webhook management error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});