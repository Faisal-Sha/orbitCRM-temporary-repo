import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateOrganizationRequest {
  organizationName: string;
  state: string;
  status: string;
  adminName: string;
  adminSurname: string;
  adminEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      organizationName,
      state,
      status,
      adminName,
      adminSurname,
      adminEmail
    }: CreateOrganizationRequest = await req.json();

    console.log("Creating organization with data:", {
      organizationName,
      state,
      status,
      adminName,
      adminSurname,
      adminEmail
    });

    // Step 1: Create Organization
    const { data: orgData, error: orgError } = await supabase
      .from('app_organizations')
      .insert({
        organization_name: organizationName,
        status: status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orgError) {
      console.error('Error creating organization:', orgError);
      throw new Error(`Failed to create organization: ${orgError.message}`);
    }

    console.log("Organization created:", orgData);

    // Step 2: Create Admin Person
    const { data: personData, error: personError } = await supabase
      .from('people')
      .insert({
        first_name: adminName,
        last_name: adminSurname,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (personError) {
      console.error('Error creating person:', personError);
      throw new Error(`Failed to create admin person: ${personError.message}`);
    }

    console.log("Person created:", personData);

    // Step 3: Create Admin Contact
    const { data: contactData, error: contactError } = await supabase
      .from('people_contacts')
      .insert({
        person_id: personData.id,
        email: adminEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (contactError) {
      console.error('Error creating contact:', contactError);
      throw new Error(`Failed to create admin contact: ${contactError.message}`);
    }

    console.log("Contact created:", contactData);

    // Step 4: Link Admin to Organization
    const { data: orgAdminData, error: orgAdminError } = await supabase
      .from('app_organization_admins')
      .insert({
        organization_id: orgData.id,
        admin_id: personData.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orgAdminError) {
      console.error('Error linking admin to organization:', orgAdminError);
      throw new Error(`Failed to link admin to organization: ${orgAdminError.message}`);
    }

    console.log("Organization admin link created:", orgAdminData);

    // Step 5: Assign Admin Role
    const { data: orgPersonData, error: orgPersonError } = await supabase
      .from('app_organization_people')
      .insert({
        organization_id: orgData.id,
        person_id: personData.id,
        user_role_id: '389ef5df-2b0c-46d0-a31b-e83cf88ba5a4', // Admin role ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orgPersonError) {
      console.error('Error assigning admin role:', orgPersonError);
      throw new Error(`Failed to assign admin role: ${orgPersonError.message}`);
    }

    console.log("Organization person role assigned:", orgPersonData);

    // Step 6: Send Invitation Email
    const invitationUrl = `${supabaseUrl.replace('https://zihgewzxoeozgfhyczhf.supabase.co', 'https://preview--lovable-supabase-integration.lovable.app')}/register?first_name=${encodeURIComponent(adminName)}&last_name=${encodeURIComponent(adminSurname)}&email=${encodeURIComponent(adminEmail)}&readonly=true`;

    const emailResponse = await resend.emails.send({
      from: "Organization Platform <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `Welcome to ${organizationName} - Complete Your Registration`,
      html: `
        <h1>Welcome to ${organizationName}!</h1>
        <p>Dear ${adminName} ${adminSurname},</p>
        <p>You have been appointed as an administrator for <strong>${organizationName}</strong>.</p>
        <p>To complete your registration and access your admin dashboard, please click the link below:</p>
        <p>
          <a href="${invitationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Complete Registration
          </a>
        </p>
        <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
        <p>${invitationUrl}</p>
        <p>This invitation is specifically for you and contains your pre-filled information for a seamless registration process.</p>
        <p>Best regards,<br>The Platform Team</p>
      `,
    });

    console.log("Invitation email sent:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      organizationId: orgData.id,
      personId: personData.id,
      invitationSent: true,
      message: "Organization created successfully and invitation sent"
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
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);