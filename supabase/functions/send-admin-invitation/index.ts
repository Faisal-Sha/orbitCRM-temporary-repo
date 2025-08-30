import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminInvitationRequest {
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  organizationName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adminFirstName, adminLastName, adminEmail, organizationName }: AdminInvitationRequest = await req.json();

    console.log("Sending admin invitation to:", adminEmail);

    // Get the current origin from the request
    const origin = req.headers.get("origin") || "http://localhost:8080";
    
    // Create invitation link with pre-filled data
    const invitationUrl = new URL(`${origin}/register`);
    invitationUrl.searchParams.set("first_name", adminFirstName);
    invitationUrl.searchParams.set("last_name", adminLastName);
    invitationUrl.searchParams.set("email", adminEmail);
    invitationUrl.searchParams.set("invitation", "true");

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
            <a href="${invitationUrl.toString()}" 
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

    console.log("Admin invitation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Admin invitation sent successfully",
      invitationUrl: invitationUrl.toString()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-admin-invitation function:", error);
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