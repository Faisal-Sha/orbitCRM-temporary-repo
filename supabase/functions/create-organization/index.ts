import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateOrganizationRequest {
  organizationName: string;
  organizationState: string;
  organizationStatus: "active" | "inactive";
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  createdByUserId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { 
      organizationName, 
      organizationState, 
      organizationStatus,
      adminFirstName, 
      adminLastName, 
      adminEmail,
      createdByUserId
    }: CreateOrganizationRequest = await req.json();

    console.log("Creating organization with data:", {
      organizationName,
      organizationState,
      organizationStatus,
      adminFirstName,
      adminLastName,
      adminEmail,
      createdByUserId
    });

    // Step 1: Create organization and admin using database function
    const { data, error } = await supabase.rpc('create_organization_with_admin', {
      organization_name: organizationName,
      organization_state: organizationState,
      admin_first_name: adminFirstName,
      admin_last_name: adminLastName,
      admin_email: adminEmail,
      created_by_user_id: createdByUserId,
      organization_status: organizationStatus
    });

    if (error) {
      console.error('Error creating organization:', error);
      throw new Error(`Failed to create organization: ${error.message}`);
    }

    console.log("Organization created successfully:", data);

    // Step 2: Send invitation email
    const siteUrl = Deno.env.get('SITE_URL') || 'https://preview--lovable-supabase-integration.lovable.app';
    console.log('SITE_URL from environment:', Deno.env.get('SITE_URL'));
    console.log('Using siteUrl for invitation:', siteUrl);
    const invitationUrl = `${siteUrl}/register?first_name=${encodeURIComponent(adminFirstName)}&last_name=${encodeURIComponent(adminLastName)}&email=${encodeURIComponent(adminEmail)}&invitation=true`;
    console.log('Generated invitation URL:', invitationUrl);

    const emailResponse = await resend.emails.send({
      from: "Admin Invitation <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `You've been invited as an admin for ${organizationName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; margin-bottom: 24px;">Admin Invitation</h1>
          
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
            Hello ${adminFirstName} ${adminLastName},
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
            You have been invited to be an administrator for <strong>${organizationName}</strong>. 
            Please click the link below to create your account and get started.
          </p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${invitationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              Create Your Admin Account
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.5; margin-top: 24px;">
            If you have any questions, please contact our support team.
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 32px;">
            This invitation was sent to ${adminEmail}. If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    console.log("Invitation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Organization created and invitation sent successfully",
      organizationId: data.organization_id,
      personId: data.person_id,
      invitationSent: true
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in create-organization function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);