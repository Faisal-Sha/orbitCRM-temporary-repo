import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature, x-hub-signature-256, x-cal-signature-256',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Webhook processors for different types
const webhookProcessors = {
  forms: processFormSubmission,
  form_submission: processFormSubmission, // legacy support
  scheduling: processCalSchedulingEvent,
  marketing: processCustomData,
  crm: processCrmData,
  crm_data: processCrmData, // legacy support
  payment: processPaymentNotification,
  payment_notification: processPaymentNotification, // legacy support
  lead_capture: processLeadCapture,
  custom: processCustomData
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get webhook ID from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const webhookId = pathParts[pathParts.length - 1];

    if (!webhookId || webhookId === 'webhook-handler') {
      return new Response(JSON.stringify({ error: 'Webhook ID required in URL path' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Webhook handler received request for ID:', webhookId);

    // Get webhook configuration
    const { data: webhook, error: webhookError } = await supabase
      .from('settings_integrations_webhooks')
      .select('*')
      .eq('id', webhookId)
      .eq('status', 'active')
      .single();

    if (webhookError || !webhook) {
      console.error('Webhook not found or inactive:', webhookError);
      return new Response(JSON.stringify({ error: 'Webhook not found or inactive' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify webhook signature if secret is provided
    const signature = req.headers.get('x-webhook-signature') || req.headers.get('x-hub-signature-256');
    const body = await req.text();
    
    if (webhook.webhook_api_secret && signature) {
      const isValidSignature = await verifySignature(body, webhook.webhook_api_secret, signature);
      if (!isValidSignature) {
        console.error('Invalid webhook signature');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Parse webhook data
    let webhookData;
    try {
      webhookData = JSON.parse(body);
    } catch (parseError) {
      console.error('Invalid JSON in request body:', parseError);
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process webhook based on type
    const processor = webhookProcessors[webhook.webhook_type as keyof typeof webhookProcessors];
    if (!processor) {
      console.error('Unknown webhook type:', webhook.webhook_type);
      return new Response(JSON.stringify({ error: 'Unknown webhook type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await processor(supabase, webhook, webhookData);
    
    console.log('Webhook processed successfully:', result.id);

    return new Response(JSON.stringify({ 
      success: true, 
      ...result,
      message: `${webhook.webhook_type} processed successfully`
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Return 200 OK to prevent retry storms for all webhooks
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Webhook received but processing failed',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function verifySignature(body: string, secret: string, signature: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const expectedHex = 'sha256=' + Array.from(new Uint8Array(expectedSignature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return signature === expectedHex;
}

// Helper function to get default status based on user role
function getDefaultStatusForRole(roleName: string): string {
  switch (roleName.toLowerCase()) {
    case 'owner':
    case 'admin':
    case 'general':
      return 'Active';
    case 'lead':
      return 'Applied';
    case 'client':
      return 'Active';
    case 'staff':
      return 'Onboarding';
    default:
      return 'Active';
  }
}

// Helper function to extract person data from submission
function extractPersonData(submissionData: any) {
  console.log('Extracting person data from:', submissionData);
  
  // Extract person table fields
  const firstName = submissionData.first_name || 
                   submissionData.firstName || 
                   submissionData['First Name'] ||
                   submissionData.name?.split(' ')[0] || 
                   submissionData.Name?.split(' ')[0] ||
                   'Unknown';

  const middleName = submissionData.middle_name || 
                    submissionData.middleName || 
                    submissionData['Middle Name'] ||
                    submissionData.middle ||
                    null;

  const lastName = submissionData.last_name || 
                  submissionData.lastName || 
                  submissionData['Last Name'] ||
                  submissionData.name?.split(' ').slice(1).join(' ') ||
                  submissionData.Name?.split(' ').slice(1).join(' ') ||
                  firstName;

  const userProfileBio = submissionData.user_profile_bio || 
                        submissionData.bio || 
                        submissionData.Bio ||
                        submissionData.profile_bio ||
                        submissionData.about ||
                        submissionData.About ||
                        null;

  // Extract contact table fields
  const email = submissionData.email || 
               submissionData.Email || 
               submissionData.user_email ||
               submissionData.emailAddress ||
               submissionData['Email Address'];

  const workEmail = submissionData.work_email || 
                   submissionData.workEmail || 
                   submissionData['Work Email'] ||
                   submissionData.business_email ||
                   submissionData.businessEmail;

  const phone = submissionData.phone || 
               submissionData.Phone || 
               submissionData.mobile ||
               submissionData.Mobile ||
               submissionData.phoneNumber ||
               submissionData.phone_number ||
               submissionData['Phone Number'];

  const phoneHome = submissionData.phone_home || 
                   submissionData.phoneHome || 
                   submissionData['Home Phone'] ||
                   submissionData.home_phone ||
                   submissionData.homePhone;

  const addressLine1 = submissionData.address || 
                      submissionData.address_line_1 || 
                      submissionData.addressLine1 ||
                      submissionData['Address Line 1'] ||
                      submissionData.street ||
                      submissionData.Street;

  const addressLine2 = submissionData.address_line_2 || 
                      submissionData.addressLine2 ||
                      submissionData['Address Line 2'] ||
                      submissionData.apt || 
                      submissionData.apartment ||
                      submissionData.unit ||
                      submissionData.suite ||
                      submissionData.Suite;

  const city = submissionData.city || submissionData.City;
  
  const state = submissionData.state || 
               submissionData.State || 
               submissionData.province || 
               submissionData.Province;
  
  const zipCode = submissionData.zip || 
                 submissionData.zip_code || 
                 submissionData.zipCode ||
                 submissionData['Zip Code'] ||
                 submissionData.postal_code || 
                 submissionData.postalCode;

  const country = submissionData.country || 
                 submissionData.Country || 
                 'USA';

  // Extract social media URLs
  const facebookUrl = submissionData.facebook || 
                     submissionData.Facebook ||
                     submissionData.facebook_url || 
                     submissionData.facebookUrl ||
                     submissionData.url_facebook;

  const instagramUrl = submissionData.instagram || 
                      submissionData.Instagram ||
                      submissionData.instagram_url || 
                      submissionData.instagramUrl ||
                      submissionData.url_instagram;

  const linkedinUrl = submissionData.linkedin || 
                     submissionData.LinkedIn ||
                     submissionData.linkedin_url || 
                     submissionData.linkedinUrl ||
                     submissionData.url_linkedin;

  const tiktokUrl = submissionData.tiktok || 
                   submissionData.TikTok ||
                   submissionData.tiktok_url || 
                   submissionData.tiktokUrl ||
                   submissionData.url_tiktok;

  // Extract user role - default to "general"
  const userRoleField = submissionData.user_role || 
                       submissionData.role || 
                       submissionData['User Role'] ||
                       submissionData.userRole ||
                       'general';

  return {
    // Person table fields
    firstName,
    middleName,
    lastName, 
    userProfileBio,
    // Contact table fields
    email,
    workEmail,
    phone,
    phoneHome,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    country,
    facebookUrl,
    instagramUrl,
    linkedinUrl,
    tiktokUrl,
    // Role field
    userRoleField
  };
}

async function processFormSubmission(supabase: any, webhook: any, data: any) {
  const formId = data.form_id || data.formId || 'unknown';
  const subTrackId = data.sub_track_id || data.subTrackId || crypto.randomUUID();

  // Extract person data from form submission using enhanced extraction
  const personData = extractPersonData(data);
  const { email, phone, firstName, lastName, userRoleField } = personData;

  console.log('Processing form submission with data:', { email, phone, firstName, lastName, userRoleField });

  // Enhanced person lookup - search by email OR phone in the same agency
  let submittedById = null;
  let existingPerson = null;
  
  if (email || phone) {
    let query = supabase
      .from('people_contacts')
      .select(`
        person_id,
        people!inner(
          id,
          first_name,
          last_name,
          user_role_id,
          status,
          app_agencies_people!inner(agency_id),
          app_user_roles(role_name)
        )
      `)
      .eq('people.app_agencies_people.agency_id', webhook.agency_id)
      .eq('is_deleted', false);

    // Build OR condition for email and phone
    if (email && phone) {
      query = query.or(`email.eq.${email},phone.eq.${phone}`);
    } else if (email) {
      query = query.eq('email', email);
    } else if (phone) {
      query = query.eq('phone', phone);
    }

    const { data: existingContact } = await query.single();

    if (existingContact?.person_id) {
      submittedById = existingContact.person_id;
      existingPerson = existingContact.people;
      console.log('Found existing person:', submittedById);

      // Update existing person with new form data
      await updateExistingPerson(supabase, existingPerson, personData, webhook.agency_id);
    } else {
      // Create new person record since none exists
      submittedById = await createNewPerson(supabase, personData, webhook.agency_id);
    }
  } else {
    // No email or phone provided - create new person anyway
    submittedById = await createNewPerson(supabase, personData, webhook.agency_id);
  }

  // Ensure submittedById is never null
  if (!submittedById) {
    throw new Error('Unable to determine or create submitted_by_id for form submission');
  }

  // Store form submission
  const { data: submission, error } = await supabase
    .from('forms_submissions')
    .insert({
      agency_id: webhook.agency_id,
      form_id: formId,
      sub_track_id: subTrackId,
      submission_data: data,
      submitted_by_id: submittedById,
      submission_status: 'active'
    })
    .select()
    .single();

  if (error) {
    console.error('Error storing form submission:', error);
    throw error;
  }

  console.log('Form submission stored successfully with ID:', submission.id);
  return { id: submission.id, type: 'form_submission' };
}

async function updateExistingPerson(supabase: any, existingPerson: any, personData: any, agencyId: string) {
  console.log('Updating existing person:', existingPerson.id);

  try {
    const { firstName, middleName, lastName, userProfileBio, userRoleField, email, phone } = personData;
    
    // Determine if role changed
    let userRoleId = existingPerson.user_role_id;
    let roleName = existingPerson.app_user_roles?.role_name;
    
    if (userRoleField && userRoleField !== 'general') {
      const { data: roleData } = await supabase
        .from('app_user_roles')
        .select('id, role_name')
        .eq('role_name', userRoleField.toLowerCase())
        .eq('is_deleted', false)
        .single();
      
      if (roleData?.id && roleData.id !== userRoleId) {
        userRoleId = roleData.id;
        roleName = roleData.role_name;
        console.log('Role changed from', existingPerson.app_user_roles?.role_name, 'to', roleName);
      }
    }

    // Get appropriate status for role
    const defaultStatus = getDefaultStatusForRole(roleName || 'general');
    
    // Update person record with all available data
    const { error: personError } = await supabase
      .from('people')
      .update({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        user_profile_bio: userProfileBio,
        user_role_id: userRoleId,
        status: defaultStatus
      })
      .eq('id', existingPerson.id);

    if (personError) {
      console.error('Error updating person:', personError);
    } else {
      console.log('Updated person record');
    }

    // Update or create contact record
    await updatePersonContact(supabase, existingPerson.id, personData);

    // Update agency association if role changed
    if (userRoleId !== existingPerson.user_role_id) {
      const { error: agencyError } = await supabase
        .from('app_agencies_people')
        .update({ user_role_id: userRoleId })
        .eq('person_id', existingPerson.id)
        .eq('agency_id', agencyId);

      if (agencyError) {
        console.error('Error updating agency association:', agencyError);
      }

      // Create new role assignment
      const { error: roleAssignError } = await supabase
        .from('people_assign_user_role')
        .update({ is_deleted: true })
        .eq('person_id', existingPerson.id)
        .eq('is_deleted', false);

      if (!roleAssignError) {
        await supabase
          .from('people_assign_user_role')
          .insert({
            person_id: existingPerson.id,
            user_role_id: userRoleId
          });
      }
    }

    // Create status record if status changed
    if (defaultStatus !== existingPerson.status) {
      await supabase
        .from('people_assign_status')
        .insert({
          person_id: existingPerson.id,
          new_status: defaultStatus,
          old_status: existingPerson.status
        });
    }

  } catch (updateError) {
    console.error('Error updating existing person:', updateError);
  }
}

async function updatePersonContact(supabase: any, personId: string, personData: any) {
  const { 
    email, phone, workEmail, phoneHome, 
    addressLine1, addressLine2, city, state, zipCode, country,
    facebookUrl, instagramUrl, linkedinUrl, tiktokUrl
  } = personData;

  // Get existing contact record
  const { data: existingContact } = await supabase
    .from('people_contacts')
    .select('*')
    .eq('person_id', personId)
    .eq('is_deleted', false)
    .single();

  // Use nullish coalescing (??) to prioritize new form data over existing data
  const contactData = {
    email: email ?? existingContact?.email,
    phone: phone ?? existingContact?.phone,
    work_email: workEmail ?? existingContact?.work_email,
    phone_home: phoneHome ?? existingContact?.phone_home,
    address_line_1: addressLine1 ?? existingContact?.address_line_1,
    address_line_2: addressLine2 ?? existingContact?.address_line_2,
    city: city ?? existingContact?.city,
    state: state ?? existingContact?.state,
    zip_code: zipCode ?? existingContact?.zip_code,
    country: country ?? existingContact?.country,
    url_facebook: facebookUrl ?? existingContact?.url_facebook,
    url_instagram: instagramUrl ?? existingContact?.url_instagram,
    url_linkedin: linkedinUrl ?? existingContact?.url_linkedin,
    url_tiktok: tiktokUrl ?? existingContact?.url_tiktok
  };

  if (existingContact) {
    // Update existing contact
    const { error: contactError } = await supabase
      .from('people_contacts')
      .update(contactData)
      .eq('id', existingContact.id);

    if (contactError) {
      console.error('Error updating contact:', contactError);
    } else {
      console.log('Updated contact record');
    }
  } else {
    // Create new contact record
    const { error: contactError } = await supabase
      .from('people_contacts')
      .insert({
        person_id: personId,
        ...contactData
      });

    if (contactError) {
      console.error('Error creating contact:', contactError);
    } else {
      console.log('Created new contact record');
    }
  }
}

async function createNewPerson(supabase: any, personData: any, agencyId: string) {
  console.log('Creating new person record for:', personData.email || personData.phone);
  
  try {
    const { firstName, middleName, lastName, userProfileBio, userRoleField } = personData;
    
    // 1. Determine user role ID - default to 'general'
    let userRoleId = null;
    let roleName = 'general';
    
    if (userRoleField && userRoleField !== 'general') {
      const { data: roleData } = await supabase
        .from('app_user_roles')
        .select('id, role_name')
        .eq('role_name', userRoleField.toLowerCase())
        .eq('is_deleted', false)
        .single();
      
      if (roleData?.id) {
        userRoleId = roleData.id;
        roleName = roleData.role_name;
      }
    }
    
    // Default to 'general' role if no role found
    if (!userRoleId) {
      const { data: defaultRole } = await supabase
        .from('app_user_roles')
        .select('id')
        .eq('role_name', 'general')
        .eq('is_deleted', false)
        .single();
      userRoleId = defaultRole?.id;
    }

    if (!userRoleId) {
      throw new Error('No valid user role found');
    }

    // Get appropriate status for role
    const defaultStatus = getDefaultStatusForRole(roleName);

    // 2. Create person record with all available data
    const { data: newPerson, error: personError } = await supabase
      .from('people')
      .insert({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        user_profile_bio: userProfileBio,
        user_role_id: userRoleId,
        status: defaultStatus
      })
      .select()
      .single();

    if (personError) {
      console.error('Error creating person:', personError);
      throw personError;
    }

    const personId = newPerson.id;
    console.log('Created new person with ID:', personId);

    // 3. Create contact record
    await updatePersonContact(supabase, personId, personData);

    // 4. Create agency association
    const { error: agencyError } = await supabase
      .from('app_agencies_people')
      .insert({
        person_id: personId,
        agency_id: agencyId,
        user_role_id: userRoleId
      });

    if (agencyError) {
      console.error('Error creating agency association:', agencyError);
    } else {
      console.log('Created agency association');
    }

    // 5. Create role assignment
    const { error: roleAssignError } = await supabase
      .from('people_assign_user_role')
      .insert({
        person_id: personId,
        user_role_id: userRoleId
      });

    if (roleAssignError) {
      console.error('Error creating role assignment:', roleAssignError);
    } else {
      console.log('Created role assignment');
    }

    // 6. Create initial status record
    const { error: statusError } = await supabase
      .from('people_assign_status')
      .insert({
        person_id: personId,
        new_status: defaultStatus,
        old_status: null
      });

    if (statusError) {
      console.error('Error creating status record:', statusError);
    } else {
      console.log('Created status record');
    }

    return personId;

  } catch (createError) {
    console.error('Error creating new person record:', createError);
    throw createError;
  }
}

async function processCrmData(supabase: any, webhook: any, data: any) {
  // Process CRM contact/lead data
  const contactData = {
    first_name: data.first_name || data.firstName || data.name?.split(' ')[0],
    last_name: data.last_name || data.lastName || data.name?.split(' ')[1],
    email: data.email || data.Email,
    phone: data.phone || data.Phone || data.mobile,
    status: data.status || 'active'
  };

  // Create person record
  const { data: person, error: personError } = await supabase
    .from('people')
    .insert({
      first_name: contactData.first_name,
      last_name: contactData.last_name,
      status: contactData.status,
      user_role_id: (await supabase.from('app_user_roles').select('id').eq('role_name', 'lead').single()).data?.id
    })
    .select()
    .single();

  if (personError) throw personError;

  // Create contact record
  if (contactData.email) {
    await supabase.from('people_contacts').insert({
      person_id: person.id,
      email: contactData.email,
      phone: contactData.phone
    });
  }

  return { id: person.id, type: 'crm_data' };
}

async function processPaymentNotification(supabase: any, webhook: any, data: any) {
  // Store payment notification data
  const { data: paymentRecord, error } = await supabase
    .from('forms_submissions') // Using forms_submissions as generic storage for now
    .insert({
      agency_id: webhook.agency_id,
      form_id: 'payment_notification',
      submission_data: data,
      submission_status: 'active'
    })
    .select()
    .single();

  if (error) throw error;
  return { id: paymentRecord.id, type: 'payment_notification' };
}

async function processLeadCapture(supabase: any, webhook: any, data: any) {
  // Process lead capture similar to CRM data but with lead-specific handling
  const leadData = {
    first_name: data.first_name || data.firstName || data.name?.split(' ')[0],
    last_name: data.last_name || data.lastName || data.name?.split(' ')[1] || '',
    email: data.email || data.Email,
    phone: data.phone || data.Phone || data.mobile,
    source: data.source || 'webhook_capture'
  };

  // Create person with lead role
  const { data: leadRole } = await supabase
    .from('app_user_roles')
    .select('id')
    .eq('role_name', 'lead')
    .single();

  const { data: person, error: personError } = await supabase
    .from('people')
    .insert({
      first_name: leadData.first_name,
      last_name: leadData.last_name,
      status: 'active',
      user_role_id: leadRole?.id
    })
    .select()
    .single();

  if (personError) throw personError;

  // Create contact record
  if (leadData.email) {
    await supabase.from('people_contacts').insert({
      person_id: person.id,
      email: leadData.email,
      phone: leadData.phone
    });
  }

  return { id: person.id, type: 'lead_capture' };
}

async function processCustomData(supabase: any, webhook: any, data: any) {
  // Store custom webhook data generically
  const { data: customRecord, error } = await supabase
    .from('forms_submissions') // Using forms_submissions as generic storage
    .insert({
      agency_id: webhook.agency_id,
      form_id: 'custom_webhook',
      submission_data: data,
      submission_status: 'active'
    })
    .select()
    .single();

  if (error) throw error;
  return { id: customRecord.id, type: 'custom' };
}

// Cal.com scheduling webhook processor
async function processCalSchedulingEvent(supabase: any, webhook: any, data: any) {
  const eventType = data.triggerEvent || data.type || 'Unknown Event';
  console.log('Processing Cal.com scheduling event:', eventType);
  console.log('Full payload received:', JSON.stringify(data, null, 2));

  let appointmentId: string | null = null;

  // Handle PING events (Cal.com test) - return 200 OK immediately
  if (eventType === 'PING' || eventType === 'ping' || data.type === 'Test') {
    console.log('PING event received - returning 200 OK');
    return { 
      type: 'ping', 
      message: 'PING event handled successfully' 
    };
  }

  try {
    // Normalize Cal.com payload - work from data.payload for real bookings
    const p = data.payload || data;
    console.log('Working with normalized payload keys:', Object.keys(p));

    // Extract booking ID with multiple fallback patterns
    const calBookingId = p.uid || 
                        p.booking?.uid || 
                        p.booking?.id || 
                        p.bookingId || 
                        p.booking_id || 
                        p.id ||
                        data.uid ||
                        data.bookingId;

    if (!calBookingId) {
      console.warn('Cal.com booking ID not found in payload - skipping appointment processing');
      console.log('Available keys in payload:', Object.keys(p));
      return { 
        type: 'cal_scheduling_no_booking_id', 
        message: 'No booking ID found' 
      };
    }

    console.log('Extracted booking ID:', calBookingId);

    // Extract appointment type first (needed for status determination)
    const appointmentType = p.userFieldsResponses?.appointment_type?.value ||
                           p.responses?.appointment_type?.value ||
                           p.eventType?.title ||
                           p.type || 
                           'General Meeting';

    console.log('Extracted appointment type:', appointmentType);

    // Determine appointment status based on event type
    // CRITICAL: Check for BOOKING_CANCELLED FIRST to ensure cancellations are properly handled
    let appointmentStatus = 'active'; // default for most cases
    
    if (eventType === 'BOOKING_CANCELLED') {
      // Always set to canceled for cancellation events, regardless of appointment type
      appointmentStatus = 'canceled';
    } else if (appointmentType && appointmentType.toLowerCase() === 'lead') {
      // Special handling for Lead appointment type - set to 'scheduled'
      appointmentStatus = 'scheduled';
    } else {
      // Event-based status for other appointments
      const statusMapping: { [key: string]: string } = {
        'BOOKING_CREATED': 'active',
        'BOOKING_REQUESTED': 'pending', 
        'BOOKING_REJECTED': 'rejected',
        'MEETING_ENDED': 'completed',
        'BOOKING_RESCHEDULED': 'rescheduled'
      };
      appointmentStatus = statusMapping[eventType] || 'active';
    }

    // Extract start and end times from normalized payload
    const startTimeRaw = p.startTime || 
                        p.startsAt || 
                        p.start;
    
    const endTimeRaw = p.endTime || 
                      p.endsAt || 
                      p.end;

    if (!startTimeRaw || !endTimeRaw) {
      console.warn('Start or end time missing in Cal.com payload - using fallback times');
    }

    const startTimeISO = startTimeRaw ? new Date(startTimeRaw).toISOString() : new Date().toISOString();
    const endTimeISO = endTimeRaw ? new Date(endTimeRaw).toISOString() : new Date(Date.now() + 3600000).toISOString();

    // Extract calendar owner ID from userFieldsResponses
    let calendarOwnerId: string | null = null;
    const calendarOwnerValue = p.userFieldsResponses?.calendar_owner_id?.value ||
                              p.responses?.calendar_owner_id?.value;
    
    console.log('Calendar owner ID from payload:', calendarOwnerValue);
    
    if (calendarOwnerValue) {
      // Verify the person exists in the people table
      const { data: ownerPerson } = await supabase
        .from('people')
        .select('id')
        .eq('id', calendarOwnerValue)
        .eq('is_deleted', false)
        .single();
      
      if (ownerPerson) {
        calendarOwnerId = calendarOwnerValue;
        console.log('Valid calendar owner found:', calendarOwnerId);
      } else {
        console.warn('Calendar owner ID not found in people table:', calendarOwnerValue);
      }
    }

    // Fallback: resolve calendar owner by organizer email if ID not found
    if (!calendarOwnerId) {
      const organizer = p.organizer || p.booker || p.user || p.owner || {};
      const ownerEmail = organizer.email || p.organizerEmail || p.ownerEmail;

      if (ownerEmail) {
        console.log('Resolving calendar owner by email:', ownerEmail);
        
        // Try to find existing person by email in this agency
        const { data: existingOwner } = await supabase
          .from('people_contacts')
          .select(`
            person_id,
            people!inner(
              id,
              app_agencies_people!inner(agency_id)
            )
          `)
          .eq('email', ownerEmail)
          .eq('people.app_agencies_people.agency_id', webhook.agency_id)
          .eq('is_deleted', false)
          .single();

        if (existingOwner?.person_id) {
          calendarOwnerId = existingOwner.person_id;
          console.log('Found existing calendar owner by email:', calendarOwnerId);
        } else {
          console.warn('Calendar owner not found by email - creating new staff person');
          // Create new staff person for the organizer
          const organizerFirst = organizer.firstName || 
                               organizer.first_name || 
                               organizer.name?.split(' ')[0] || 
                               'Calendar';
          const organizerLast = organizer.lastName || 
                              organizer.last_name || 
                              organizer.name?.split(' ').slice(1).join(' ') || 
                              'Owner';

          try {
            calendarOwnerId = await createNewPerson(supabase, {
              firstName: organizerFirst,
              middleName: null,
              lastName: organizerLast,
              userProfileBio: null,
              email: ownerEmail,
              phone: organizer.phone || organizer.phoneNumber || null,
              userRoleField: 'staff'
            }, webhook.agency_id);
            console.log('Created new calendar owner:', calendarOwnerId);
          } catch (createError) {
            console.error('Failed to create calendar owner:', createError);
          }
        }
      } else {
        console.warn('No organizer email found - calendar owner will be null');
      }
    }

    // appointmentType already extracted above

    // Extract reschedule UID for reschedule_id column
    const rescheduleUid = p.rescheduleUid || null;
    console.log('Extracted reschedule UID:', rescheduleUid);

    // Parse location data from Cal.com responses
    let location = 'Not specified';
    let locationDetails = 'Not specified';
    
    if (p.responses?.location?.value) {
      // Location type (e.g., "Attendee Phone Number", "Google Meet", etc.)
      location = p.responses.location.value.optionValue || p.responses.location.label || 'Phone';
      // Actual location value (phone number, URL, address, etc.)
      locationDetails = p.responses.location.value.value || p.location || 'Not specified';
    } else {
      locationDetails = p.location || 
                       p.meetingUrl || 
                       p.locationUrl ||
                       p.address ||
                       'Cal.com';
    }

    console.log('Extracted values - bookingId:', calBookingId, 'start:', startTimeISO, 'end:', endTimeISO, 'owner:', calendarOwnerId, 'type:', appointmentType, 'location:', location, 'locationDetails:', locationDetails, 'rescheduleUid:', rescheduleUid);

    // Extract cancellation data from payload (if applicable)
    const cancellationReason = p.cancellationReason || null;
    const cancelledBy = p.cancelledBy || null;
    console.log('Cancellation data - reason:', cancellationReason, 'cancelledBy:', cancelledBy);

    // Check if appointment already exists (robust multi-identifier lookup)
    console.log('Looking for existing appointment with cal_booking_id:', calBookingId, 'in agency:', webhook.agency_id);

    // Prepare multiple identifiers
    const calUid = p.uid || p.booking?.uid || null;
    const calBookingIdStr = (p.bookingId || p.booking?.id) ? String(p.bookingId || p.booking?.id) : null;
    const iCalUID = p.iCalUID || p.icalUID || p.iCalUid || null;
    const iCalUIDStripped = iCalUID ? String(iCalUID).split('@')[0] : null;

    let existingAppointment: any = null;

    // Attempt 1: direct cal_booking_id match with extracted calBookingId
    {
      const { data } = await supabase
        .from('schedule_appointments')
        .select('id, appointment_status')
        .eq('cal_booking_id', calBookingId)
        .eq('agency_id', webhook.agency_id)
        .maybeSingle();
      if (data) {
        existingAppointment = data;
        console.log('Found existing appointment by cal_booking_id:', data.id);
      }
    }

    // Attempt 2: try UID specifically
    if (!existingAppointment && calUid && calUid !== calBookingId) {
      const { data } = await supabase
        .from('schedule_appointments')
        .select('id, appointment_status')
        .eq('cal_booking_id', calUid)
        .eq('agency_id', webhook.agency_id)
        .maybeSingle();
      if (data) {
        existingAppointment = data;
        console.log('Found existing appointment by UID:', data.id);
      }
    }

    // Attempt 3: try numeric bookingId
    if (!existingAppointment && calBookingIdStr && calBookingIdStr !== calBookingId) {
      const { data } = await supabase
        .from('schedule_appointments')
        .select('id, appointment_status')
        .eq('cal_booking_id', calBookingIdStr)
        .eq('agency_id', webhook.agency_id)
        .maybeSingle();
      if (data) {
        existingAppointment = data;
        console.log('Found existing appointment by numeric bookingId:', data.id);
      }
    }

    // Attempt 4: try stripped iCal UID
    if (!existingAppointment && iCalUIDStripped) {
      const { data } = await supabase
        .from('schedule_appointments')
        .select('id, appointment_status')
        .eq('cal_booking_id', iCalUIDStripped)
        .eq('agency_id', webhook.agency_id)
        .maybeSingle();
      if (data) {
        existingAppointment = data;
        console.log('Found existing appointment by iCalUIDStripped:', data.id);
      }
    }

    // Attempt 5: match on booking_details JSON -> uid or bookingId
    if (!existingAppointment && calUid) {
      const { data } = await supabase
        .from('schedule_appointments')
        .select('id, appointment_status')
        .filter('booking_details->>uid', 'eq', calUid)
        .eq('agency_id', webhook.agency_id)
        .maybeSingle();
      if (data) {
        existingAppointment = data;
        console.log('Found existing appointment by booking_details.uid:', data.id);
      }
    }

    if (!existingAppointment && calBookingIdStr) {
      const { data } = await supabase
        .from('schedule_appointments')
        .select('id, appointment_status')
        .filter('booking_details->>bookingId', 'eq', calBookingIdStr)
        .eq('agency_id', webhook.agency_id)
        .maybeSingle();
      if (data) {
        existingAppointment = data;
        console.log('Found existing appointment by booking_details.bookingId:', data.id);
      }
    }

    // Attempt 5b: match on booking_details JSON -> iCalUID or stripped
    if (!existingAppointment && iCalUID) {
      const { data } = await supabase
        .from('schedule_appointments')
        .select('id, appointment_status')
        .filter('booking_details->>iCalUID', 'eq', iCalUID)
        .eq('agency_id', webhook.agency_id)
        .maybeSingle();
      if (data) {
        existingAppointment = data;
        console.log('Found existing appointment by booking_details.iCalUID:', data.id);
      }
    }

    if (!existingAppointment && iCalUIDStripped) {
      const { data } = await supabase
        .from('schedule_appointments')
        .select('id, appointment_status')
        .filter('booking_details->>iCalUID', 'eq', iCalUIDStripped)
        .eq('agency_id', webhook.agency_id)
        .maybeSingle();
      if (data) {
        existingAppointment = data;
        console.log('Found existing appointment by booking_details.iCalUID (stripped):', data.id);
      }
    }

    // Attempt 6: match by owner + time window
    if (!existingAppointment && calendarOwnerId) {
      const { data } = await supabase
        .from('schedule_appointments')
        .select('id, appointment_status')
        .eq('calendar_owner_id', calendarOwnerId)
        .eq('start_time', startTimeISO)
        .eq('end_time', endTimeISO)
        .eq('agency_id', webhook.agency_id)
        .maybeSingle();
      if (data) {
        existingAppointment = data;
        console.log('Found existing appointment by owner+time:', data.id);
      }
    }

    if (existingAppointment) {
      console.log('Final matched appointment:', existingAppointment.id, 'with status:', existingAppointment.appointment_status);
    } else {
      console.log('No existing appointment found after all strategies for booking ID/UID:', calBookingId, 'owner:', calendarOwnerId);
    }


    if (existingAppointment) {
      // Update existing appointment
      console.log('Updating existing appointment:', existingAppointment.id, 'with status:', appointmentStatus);
      
      // Build update object with base fields
      const updateData: any = {
        appointment_status: appointmentStatus,
        location: location,
        location_details: locationDetails,
        booking_details: p,
        start_time: startTimeISO,
        end_time: endTimeISO,
        reschedule_id: rescheduleUid,
        updated_by: calendarOwnerId,
        updated_at: new Date().toISOString()
      };

      // Add cancellation-specific fields if this is a cancellation event
      if (eventType === 'BOOKING_CANCELLED') {
        updateData.cancellation_reason = cancellationReason;
        updateData.canceled_by = calendarOwnerId; // Person who owns the calendar
        updateData.canceled_at = new Date().toISOString();
        console.log('Adding cancellation fields - reason:', cancellationReason, 'canceled_by:', calendarOwnerId);
      }
      
      const { data: updatedAppointment, error: updateError } = await supabase
        .from('schedule_appointments')
        .update(updateData)
        .eq('id', existingAppointment.id)
        .select('id')
        .single();

      if (updateError) {
        console.error('Error updating appointment:', updateError);
        console.error('Update error details:', JSON.stringify(updateError, null, 2));
      } else {
        appointmentId = updatedAppointment.id;
        console.log('Updated appointment:', appointmentId);
      }

      if (updateError) {
        console.error('Error updating appointment:', updateError);
      } else {
        appointmentId = updatedAppointment.id;
        console.log('Updated appointment:', appointmentId);
      }
    } else if (eventType === 'BOOKING_CREATED' || eventType === 'BOOKING_REQUESTED') {
      // Create new appointment for booking creation/request
      console.log('Creating new appointment');
      
      const { data: newAppointment, error: createError } = await supabase
        .from('schedule_appointments')
        .insert({
          agency_id: webhook.agency_id,
          calendar_owner_id: calendarOwnerId,
          cal_booking_id: calBookingId,
          appointment_type: appointmentType,
          appointment_status: appointmentStatus,
          start_time: startTimeISO,
          end_time: endTimeISO,
          location: location,
          location_details: locationDetails,
          reschedule_id: rescheduleUid,
          booking_details: p,
          created_by: calendarOwnerId,
          updated_by: calendarOwnerId
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating appointment:', createError);
        console.error('Create error details:', JSON.stringify(createError, null, 2));
        console.error('Insert data that failed:', {
          agency_id: webhook.agency_id,
          calendar_owner_id: calendarOwnerId,
          cal_booking_id: calBookingId,
          appointment_type: appointmentType,
          appointment_status: appointmentStatus,
          location: locationDetails
        });
      } else {
        appointmentId = newAppointment.id;
        console.log('Created new appointment:', appointmentId);

        // Process attendees for new bookings
        if (appointmentId) {
          try {
            await processCalAttendees(supabase, appointmentId, p, webhook.agency_id, appointmentType, webhook, calendarOwnerId);
          } catch (attendeeError) {
            console.error('Error processing attendees:', attendeeError);
          }
        }
      }
    } else {
      console.log('Event type does not require appointment creation:', eventType);
    }

    // Insert trigger log now that we have calendarOwnerId and appointmentId
    let triggerLogId: string | null = null;
    if (calendarOwnerId) {
      try {
        console.log('Inserting trigger log with triggered_by_user_id:', calendarOwnerId, 'appointment_id:', appointmentId);
        
        const { data: triggerLogRow, error: logError } = await supabase
          .from('schedule_appointment_trigger_log')
          .insert({
            trigger_event: eventType,
            event_source: 'Cal.com',
            raw_event_payload: data,
            appointment_id: appointmentId, // Now we have the appointment ID
            triggered_by_user_id: calendarOwnerId // Resolved people.id
          })
          .select('id')
          .single();

        if (logError) {
          console.error('Error logging Cal.com event:', logError);
        } else {
          triggerLogId = triggerLogRow?.id;
          console.log('Successfully logged Cal.com event with ID:', triggerLogId);
        }
      } catch (logErr) {
        console.error('Failed to log Cal.com event:', logErr);
      }
    } else {
      console.warn('Skipping trigger log insert - no calendarOwnerId resolved');
    }

    console.log('Cal.com event processed successfully');
    return { 
      id: appointmentId || triggerLogId,
      type: 'cal_scheduling',
      event: eventType,
      status: appointmentStatus,
      booking_id: calBookingId
    };

  } catch (error) {
    console.error('Error processing Cal.com event:', error);
    
    // Don't throw - return 200 OK to Cal.com with error logged
    return { 
      type: 'cal_scheduling_error', 
      message: 'Processing failed',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Helper function to process Cal.com attendees
async function processCalAttendees(supabase: any, appointmentId: string, bookingData: any, agencyId: string, appointmentType: string, webhook: any, calendarOwnerId: string | null) {
  console.log('Processing Cal.com attendees for appointment:', appointmentId);

  // Extract attendees from booking data - prioritize attendees array
  const attendees = bookingData.attendees || [];
  console.log('Found attendees:', attendees.length, attendees);
  
  // Get organizer email to exclude from attendees (since they're already the calendar owner)
  const organizer = bookingData.organizer || bookingData.booker || bookingData.user || bookingData.owner || {};
  const organizerEmail = organizer.email || bookingData.organizerEmail || bookingData.ownerEmail;

  for (const attendee of attendees) {
    try {
      const email = attendee.email;
      const phone = attendee.phone || attendee.phoneNumber;
      const firstName = attendee.firstName || attendee.first_name || attendee.name?.split(' ')[0] || 'Unknown';
      const lastName = attendee.lastName || attendee.last_name || attendee.name?.split(' ').slice(1).join(' ') || '';

      // Skip if neither email nor phone exists
      if (!email && !phone) {
        console.log('Skipping attendee - no email or phone provided');
        continue;
      }

      // Skip if this attendee is the organizer/calendar owner (they're already in schedule_appointments)
      if (email && organizerEmail && email.toLowerCase() === organizerEmail.toLowerCase()) {
        console.log('Skipping organizer/calendar owner from attendees:', email);
        continue;
      }

      // Check if person exists by email OR phone in the same agency
      let personId = null;
      let existingPerson = null;

      if (email || phone) {
        let query = supabase
          .from('people_contacts')
          .select(`
            person_id,
            people!inner(
              id,
              first_name,
              last_name,
              user_role_id,
              status,
              app_agencies_people!inner(agency_id),
              app_user_roles(role_name)
            )
          `)
          .eq('people.app_agencies_people.agency_id', agencyId)
          .eq('is_deleted', false);

        if (email && phone) {
          query = query.or(`email.eq.${email},phone.eq.${phone}`);
        } else if (email) {
          query = query.eq('email', email);
        } else if (phone) {
          query = query.eq('phone', phone);
        }

        const { data: existingContact } = await query.single();

        if (existingContact?.person_id) {
          personId = existingContact.person_id;
          existingPerson = existingContact.people;
          console.log('Found existing person for attendee:', personId);
        }
      }

      // Create new person if not found
      if (!personId) {
        console.log('Creating new person for Cal.com attendee:', email || phone);
        
        // Get user role based on appointment type
        let userRoleId = null;
        let roleName = 'general';
        
        if (appointmentType) {
          const { data: roleData } = await supabase
            .from('app_user_roles')
            .select('id, role_name')
            .eq('role_name', appointmentType.toLowerCase())
            .eq('is_deleted', false)
            .single();
          
          if (roleData?.id) {
            userRoleId = roleData.id;
            roleName = roleData.role_name;
          }
        }
        
        // Default to 'general' role if no role found
        if (!userRoleId) {
          const { data: defaultRole } = await supabase
            .from('app_user_roles')
            .select('id')
            .eq('role_name', 'general')
            .eq('is_deleted', false)
            .single();
          userRoleId = defaultRole?.id;
        }

        if (!userRoleId) {
          throw new Error('No valid user role found for Cal.com attendee');
        }

        // Set status based on role: "Scheduled" for leads, "Active" for others
        const defaultStatus = roleName.toLowerCase() === 'lead' ? 'Scheduled' : 'Active';

        // Create person record (created_by/updated_by use auth.users.id, so set to NULL)
        const { data: newPerson, error: personError } = await supabase
          .from('people')
          .insert({
            first_name: firstName,
            last_name: lastName,
            user_role_id: userRoleId,
            status: defaultStatus
            // created_by/updated_by will be NULL since we don't have auth.users.id
          })
          .select()
          .single();

        if (personError) {
          console.error('Error creating person for Cal.com attendee:', personError);
          continue;
        }

        personId = newPerson.id;
        console.log('Created new person with ID:', personId);

        // Create contact record (created_by/updated_by use auth.users.id, so set to NULL)
        if (email || phone) {
          const { error: contactError } = await supabase
            .from('people_contacts')
            .insert({
              person_id: personId,
              email: email || 'temp@example.com',
              phone: phone
              // created_by/updated_by will be NULL since we don't have auth.users.id
            });

          if (contactError) {
            console.error('Error creating contact for Cal.com attendee:', contactError);
          } else {
            console.log('Created contact record for attendee');
          }
        }

        // Create agency association with webhook's agency_id (created_by/updated_by use auth.users.id, so set to NULL)
        const { error: agencyError } = await supabase
          .from('app_agencies_people')
          .insert({
            person_id: personId,
            agency_id: agencyId,
            user_role_id: userRoleId
            // created_by/updated_by will be NULL since we don't have auth.users.id
          });

        if (agencyError) {
          console.error('Error creating agency association for Cal.com attendee:', agencyError);
        } else {
          console.log('Created agency association for attendee');
        }

        // Create role assignment (created_by/updated_by use auth.users.id, so set to NULL)
        const { error: roleAssignError } = await supabase
          .from('people_assign_user_role')
          .insert({
            person_id: personId,
            user_role_id: userRoleId
            // created_by/updated_by will be NULL since we don't have auth.users.id
          });

        if (roleAssignError) {
          console.error('Error creating role assignment for Cal.com attendee:', roleAssignError);
        }

        // Create initial status record (created_by/updated_by use auth.users.id, so set to NULL)
        const { error: statusError } = await supabase
          .from('people_assign_status')
          .insert({
            person_id: personId,
            new_status: defaultStatus,
            old_status: null
            // created_by/updated_by will be NULL since we don't have auth.users.id
          });

        if (statusError) {
          console.error('Error creating status record for Cal.com attendee:', statusError);
        }
      }

      // Link attendee to appointment
      if (personId) {
        // Use calendarOwnerId parameter for foreign key constraint
        const calendarOwnerIdForAttendee = calendarOwnerId;
        
        const { error: attendeeError } = await supabase
          .from('schedule_appointment_attendees')
          .insert({
            appointment_id: appointmentId,
            attendee_id: personId,
            created_by: calendarOwnerIdForAttendee,
            updated_by: calendarOwnerIdForAttendee
          });

        if (attendeeError) {
          console.error('Error linking attendee to appointment:', attendeeError);
          console.error('Attendee error details:', JSON.stringify(attendeeError, null, 2));
          console.error('Attendee insert data that failed:', {
            appointment_id: appointmentId,
            attendee_id: personId,
            created_by: calendarOwnerIdForAttendee
          });
        } else {
          console.log('Linked attendee to appointment:', personId);
        }
      }

    } catch (attendeeError) {
      console.error('Error processing Cal.com attendee:', attendeeError);
      // Continue processing other attendees
    }
  }
}