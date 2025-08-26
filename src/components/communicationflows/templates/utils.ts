
export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'email': return '📧';
    case 'sms': return '💬';
    case 'aivoice': return '🎤';
    case 'knowledge': return '📚';
    case 'confirmation': return '✅';
    case 'pdf': return '📄';
    default: return '📄';
  }
};

export const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'email': return 'bg-blue-100 text-blue-800';
    case 'emailcampaign': return 'bg-indigo-100 text-indigo-800';
    case 'sms': return 'bg-green-100 text-green-800';
    case 'aivoice': return 'bg-purple-100 text-purple-800';
    case 'knowledge': return 'bg-orange-100 text-orange-800';
    case 'confirmation': return 'bg-teal-100 text-teal-800';
    case 'pdf': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getContextLabel = (context: string) => 
  context === 'calendar' ? 'calendars' : 
  context === 'form' ? 'forms' : 
  context === 'confirmation' ? 'confirmations' : 
  context === 'email_campaign' ? 'email campaigns' : 'PDFs';

export const getUsedBy = (template: any, context: string) => 
  context === 'calendar' ? template.usedByCalendars : 
  context === 'form' ? template.usedByForms : 
  context === 'confirmation' ? template.usedByConfirmations : 
  context === 'email_campaign' ? template.usedByEmailCampaigns :
  template.usedByPDFs;

export const getDefaultTemplates = (context: 'calendar' | 'form' | 'confirmation' | 'pdf' | 'email_campaign') => {
  if (context === 'calendar') {
    return [
      {
        id: 1,
        name: 'Appointment Confirmation',
        type: 'email' as const,
        context: 'calendar' as const,
        content: '<h2>Your Appointment is Confirmed</h2><p>Dear {{Contact.FirstName}},</p><p>Your appointment has been confirmed for {{Appointment.Date}} at {{Appointment.Time}}.</p><p>Location: {{Appointment.Location}}</p><p>Provider: {{Appointment.ProviderName}}</p>',
        subject: 'Appointment Confirmed - {{Appointment.Date}}',
        usedByCalendars: ['Dr. Smith Schedule', 'General Consultations']
      },
      {
        id: 2,
        name: 'Appointment Reminder',
        type: 'sms' as const,
        context: 'calendar' as const,
        content: 'Reminder: You have an appointment tomorrow at {{Appointment.Time}} with {{Appointment.ProviderName}}. Reply CONFIRM to confirm.',
        usedByCalendars: ['Dr. Smith Schedule']
      },
      {
        id: 3,
        name: 'Cancellation Notice',
        type: 'email' as const,
        context: 'calendar' as const,
        content: '<h2>Appointment Cancelled</h2><p>Dear {{Contact.FirstName}},</p><p>Your appointment scheduled for {{Appointment.Date}} at {{Appointment.Time}} has been cancelled.</p><p>Please reschedule at your convenience.</p>',
        subject: 'Appointment Cancelled - {{Appointment.Date}}',
        usedByCalendars: ['Dr. Smith Schedule', 'Emergency Clinic']
      },
      {
        id: 4,
        name: 'Reschedule Request',
        type: 'email' as const,
        context: 'calendar' as const,
        content: '<h2>Reschedule Your Appointment</h2><p>Dear {{Contact.FirstName}},</p><p>We need to reschedule your appointment originally set for {{Appointment.Date}}.</p><p>Please use this link to select a new time: {{Appointment.RescheduleURL}}</p>',
        subject: 'Reschedule Required - {{Contact.FirstName}}',
        usedByCalendars: ['Dr. Smith Schedule']
      },
      {
        id: 5,
        name: 'Follow-up Appointment',
        type: 'email' as const,
        context: 'calendar' as const,
        content: '<h2>Schedule Your Follow-up</h2><p>Dear {{Contact.FirstName}},</p><p>Following your recent appointment, we recommend scheduling a follow-up visit.</p><p>Please call us or use our online booking system.</p>',
        subject: 'Follow-up Appointment Recommended',
        usedByCalendars: ['Dr. Smith Schedule', 'Therapy Sessions']
      },
      {
        id: 6,
        name: 'No-Show Follow-up',
        type: 'sms' as const,
        context: 'calendar' as const,
        content: 'We missed you at your appointment today. Please call us to reschedule: {{Company.Phone}}',
        usedByCalendars: ['Dr. Smith Schedule', 'General Consultations']
      },
      {
        id: 7,
        name: 'Virtual Meeting Instructions',
        type: 'email' as const,
        context: 'calendar' as const,
        content: '<h2>Virtual Appointment Instructions</h2><p>Dear {{Contact.FirstName}},</p><p>Your virtual appointment is scheduled for {{Appointment.Date}} at {{Appointment.Time}}.</p><p>Join the meeting: {{Appointment.JoinURL}}</p><p>Please test your connection 10 minutes early.</p>',
        subject: 'Virtual Appointment - {{Appointment.Date}}',
        usedByCalendars: ['Telehealth Sessions']
      },
      {
        id: 8,
        name: 'Appointment Voice Reminder',
        type: 'aivoice' as const,
        context: 'calendar' as const,
        content: 'Hello {{Contact.FirstName}}, this is a reminder about your upcoming appointment on {{Appointment.Date}} at {{Appointment.Time}} with {{Appointment.ProviderName}}. Please call us if you need to reschedule.',
        voice: 'kim',
        usedByCalendars: ['Dr. Smith Schedule']
      },
      {
        id: 9,
        name: 'Pre-Appointment Instructions',
        type: 'email' as const,
        context: 'calendar' as const,
        content: '<h2>Pre-Appointment Instructions</h2><p>Dear {{Contact.FirstName}},</p><p>Please prepare for your upcoming appointment on {{Appointment.Date}}:</p><ul><li>Arrive 15 minutes early</li><li>Bring your insurance card</li><li>Complete the intake forms</li></ul>',
        subject: 'Pre-Appointment Guidelines - {{Appointment.Date}}',
        usedByCalendars: ['New Patient Intake']
      },
      {
        id: 10,
        name: 'Appointment Knowledge Base',
        type: 'knowledge' as const,
        context: 'calendar' as const,
        content: 'General information about appointments: Our office hours are 9 AM to 5 PM, Monday through Friday. We require 24-hour notice for cancellations. Insurance cards must be presented at each visit.',
        knowledgeBase: 'appointment-policies',
        usedByCalendars: ['General Consultations', 'Therapy Sessions']
      }
    ];
  }
  
  if (context === 'form') {
    return [
      {
        id: 11,
        name: 'Form Submission Confirmation',
        type: 'email' as const,
        context: 'form' as const,
        content: '<h2>Thank You for Your Submission</h2><p>Dear {{Contact.FirstName}},</p><p>We have received your {{FORM_TITLE}} submission.</p><p>Your responses have been recorded and we will review them shortly.</p>',
        subject: 'Form Submission Received - {{FORM_TITLE}}',
        usedByForms: ['Patient Intake Form', 'Health Assessment']
      },
      {
        id: 12,
        name: 'Incomplete Form Reminder',
        type: 'sms' as const,
        context: 'form' as const,
        content: 'Hi {{Contact.FirstName}}, you have an incomplete form: {{FORM_TITLE}}. Please complete it when you have a moment.',
        usedByForms: ['Patient Intake Form']
      },
      {
        id: 13,
        name: 'Form Review Results',
        type: 'email' as const,
        context: 'form' as const,
        content: '<h2>Form Review Complete</h2><p>Dear {{Contact.FirstName}},</p><p>We have reviewed your {{FORM_TITLE}} submission.</p><p>Your score: {{QUIZ_SCORE}}</p><p>Next steps will be communicated separately.</p>',
        subject: 'Form Review Results - {{FORM_TITLE}}',
        usedByForms: ['Health Assessment', 'Therapy Evaluation']
      },
      {
        id: 14,
        name: 'Form Submission Voice Notification',
        type: 'aivoice' as const,
        context: 'form' as const,
        content: 'Hello {{Contact.FirstName}}, thank you for completing the {{FORM_TITLE}}. We have received your submission and will be in touch soon.',
        voice: 'kim',
        usedByForms: ['Patient Intake Form']
      },
      {
        id: 15,
        name: 'Quiz Results Notification',
        type: 'email' as const,
        context: 'form' as const,
        content: '<h2>Your Quiz Results</h2><p>Dear {{Contact.FirstName}},</p><p>You have completed {{FORM_TITLE}} with a score of {{QUIZ_SCORE}}.</p><p>Great job! Keep up the excellent work.</p>',
        subject: 'Quiz Results - {{QUIZ_SCORE}} points',
        usedByForms: ['Health Quiz', 'Wellness Assessment']
      },
      {
        id: 16,
        name: 'Form Expiration Warning',
        type: 'sms' as const,
        context: 'form' as const,
        content: 'Reminder: Your {{FORM_TITLE}} will expire in 24 hours. Please complete it soon.',
        usedByForms: ['Patient Intake Form', 'Health Assessment']
      },
      {
        id: 17,
        name: 'Form Completion Certificate',
        type: 'email' as const,
        context: 'form' as const,
        content: '<h2>Certificate of Completion</h2><p>Congratulations {{Contact.FirstName}}!</p><p>You have successfully completed {{FORM_TITLE}}.</p><p>Your final score: {{QUIZ_SCORE}}</p><p>This certificate confirms your participation.</p>',
        subject: 'Certificate - {{FORM_TITLE}} Completed',
        usedByForms: ['Training Module', 'Certification Quiz']
      },
      {
        id: 18,
        name: 'Form Data Review',
        type: 'knowledge' as const,
        context: 'form' as const,
        content: 'Form submission guidelines: All forms must be completed within 7 days. Incomplete submissions will be automatically deleted. Quiz scores are calculated based on correct answers.',
        knowledgeBase: 'form-policies',
        usedByForms: ['All Forms']
      },
      {
        id: 19,
        name: 'Retake Opportunity',
        type: 'email' as const,
        context: 'form' as const,
        content: '<h2>Retake Available</h2><p>Dear {{Contact.FirstName}},</p><p>Your score for {{FORM_TITLE}} was {{QUIZ_SCORE}}.</p><p>You have the option to retake this assessment to improve your score.</p>',
        subject: 'Retake Opportunity - {{FORM_TITLE}}',
        usedByForms: ['Health Quiz', 'Certification Quiz']
      },
      {
        id: 20,
        name: 'Form Submission Follow-up',
        type: 'sms' as const,
        context: 'form' as const,
        content: 'Thank you for completing {{FORM_TITLE}}. Based on your responses, we recommend scheduling a consultation. Call {{Company.Phone}}.',
        usedByForms: ['Health Assessment', 'Therapy Evaluation']
      }
    ];
  }
  
  if (context === 'confirmation') {
    return [
      {
        id: 21,
        name: 'Standard Confirmation',
        type: 'confirmation' as const,
        context: 'confirmation' as const,
        content: '<h2>Thank You!</h2><p>Your {{FORM_TITLE}} has been submitted successfully.</p><p>Submission Score: {{QUIZ_SCORE}}</p><p>We will review your information and contact you soon.</p>',
        usedByConfirmations: ['Contact Form', 'Registration Form']
      },
      {
        id: 22,
        name: 'Registration Confirmation',
        type: 'confirmation' as const,
        context: 'confirmation' as const,
        content: '<h2>Registration Complete!</h2><p>Welcome! Your registration for {{FORM_TITLE}} is now complete.</p><p>Your score: {{QUIZ_SCORE}}</p><p>Check your email for next steps.</p>',
        usedByConfirmations: ['Event Registration', 'Course Enrollment']
      },
      {
        id: 23,
        name: 'Assessment Completion',
        type: 'confirmation' as const,
        context: 'confirmation' as const,
        content: '<h2>Assessment Complete</h2><p>You have successfully completed {{FORM_TITLE}}.</p><p>Your final score: {{QUIZ_SCORE}}</p><p>Results will be available in your portal within 24 hours.</p>',
        usedByConfirmations: ['Health Assessment', 'Skills Evaluation']
      },
      {
        id: 24,
        name: 'Booking Confirmation',
        type: 'confirmation' as const,
        context: 'confirmation' as const,
        content: '<h2>Booking Confirmed</h2><p>Thank you for completing {{FORM_TITLE}}!</p><p>Your booking has been confirmed and you will receive a confirmation email shortly.</p>',
        usedByConfirmations: ['Appointment Booking', 'Service Request']
      },
      {
        id: 25,
        name: 'Survey Thank You',
        type: 'confirmation' as const,
        context: 'confirmation' as const,
        content: '<h2>Thank You for Your Feedback</h2><p>Your responses to {{FORM_TITLE}} are valuable to us.</p><p>Completion score: {{QUIZ_SCORE}}</p><p>Your input helps us improve our services.</p>',
        usedByConfirmations: ['Customer Survey', 'Feedback Form']
      },
      {
        id: 26,
        name: 'Application Received',
        type: 'confirmation' as const,
        context: 'confirmation' as const,
        content: '<h2>Application Received</h2><p>We have received your {{FORM_TITLE}} application.</p><p>Application score: {{QUIZ_SCORE}}</p><p>Our team will review it and contact you within 3-5 business days.</p>',
        usedByConfirmations: ['Job Application', 'Grant Application']
      },
      {
        id: 27,
        name: 'Quiz Results',
        type: 'confirmation' as const,
        context: 'confirmation' as const,
        content: '<h2>Quiz Complete!</h2><p>Congratulations on completing {{FORM_TITLE}}!</p><p>Your score: {{QUIZ_SCORE}} points</p><p>You can retake the quiz anytime to improve your score.</p>',
        usedByConfirmations: ['Knowledge Quiz', 'Training Assessment']
      },
      {
        id: 28,
        name: 'Subscription Confirmation',
        type: 'confirmation' as const,
        context: 'confirmation' as const,
        content: '<h2>Subscription Active</h2><p>Thank you for completing {{FORM_TITLE}}!</p><p>Your subscription is now active and you will receive updates regularly.</p>',
        usedByConfirmations: ['Newsletter Signup', 'Service Subscription']
      },
      {
        id: 29,
        name: 'Contest Entry',
        type: 'confirmation' as const,
        context: 'confirmation' as const,
        content: '<h2>Contest Entry Confirmed</h2><p>Your entry for {{FORM_TITLE}} has been received!</p><p>Entry score: {{QUIZ_SCORE}}</p><p>Winners will be announced next month. Good luck!</p>',
        usedByConfirmations: ['Photo Contest', 'Essay Competition']
      },
      {
        id: 30,
        name: 'Feedback Received',
        type: 'confirmation' as const,
        context: 'confirmation' as const,
        content: '<h2>Feedback Appreciated</h2><p>Thank you for taking the time to complete {{FORM_TITLE}}.</p><p>Your detailed feedback helps us serve you better.</p>',
        usedByConfirmations: ['Service Feedback', 'Product Review']
      }
    ];
  }
  
  if (context === 'pdf') {
    return [
      {
        id: 31,
        name: 'Form Summary Report',
        type: 'pdf' as const,
        context: 'pdf' as const,
        content: '<h1>Form Submission Report</h1><h2>{{FORM_TITLE}}</h2><p><strong>Submission Date:</strong> {{System.CurrentDate}}</p><p><strong>Total Score:</strong> {{QUIZ_SCORE}}</p><p>This report contains all the details from your form submission.</p>',
        usedByPDFs: ['Patient Records', 'Assessment Reports']
      },
      {
        id: 32,
        name: 'Certificate Template',
        type: 'pdf' as const,
        context: 'pdf' as const,
        content: '<div style="text-align: center;"><h1>Certificate of Completion</h1><h2>{{FORM_TITLE}}</h2><p>This certifies that the holder has successfully completed the requirements.</p><p><strong>Score Achieved:</strong> {{QUIZ_SCORE}}</p><p><strong>Date:</strong> {{System.CurrentDate}}</p></div>',
        usedByPDFs: ['Training Certificates', 'Course Completions']
      },
      {
        id: 33,
        name: 'Assessment Results',
        type: 'pdf' as const,
        context: 'pdf' as const,
        content: '<h1>Assessment Results</h1><h2>{{FORM_TITLE}}</h2><p><strong>Assessment Score:</strong> {{QUIZ_SCORE}}</p><p><strong>Date Completed:</strong> {{System.CurrentDate}}</p><p>Detailed analysis and recommendations based on your responses.</p>',
        usedByPDFs: ['Health Assessments', 'Skills Evaluations']
      },
      {
        id: 34,
        name: 'Registration Confirmation PDF',
        type: 'pdf' as const,
        context: 'pdf' as const,
        content: '<h1>Registration Confirmation</h1><h2>{{FORM_TITLE}}</h2><p>This document confirms your successful registration.</p><p><strong>Registration Score:</strong> {{QUIZ_SCORE}}</p><p>Please keep this document for your records.</p>',
        usedByPDFs: ['Event Registrations', 'Course Enrollments']
      },
      {
        id: 35,
        name: 'Survey Response Summary',
        type: 'pdf' as const,
        context: 'pdf' as const,
        content: '<h1>Survey Response Summary</h1><h2>{{FORM_TITLE}}</h2><p>Thank you for participating in our survey.</p><p><strong>Completion Score:</strong> {{QUIZ_SCORE}}</p><p>Your responses contribute to our continuous improvement efforts.</p>',
        usedByPDFs: ['Customer Surveys', 'Research Studies']
      },
      {
        id: 36,
        name: 'Application Receipt',
        type: 'pdf' as const,
        context: 'pdf' as const,
        content: '<h1>Application Receipt</h1><h2>{{FORM_TITLE}}</h2><p>This document serves as proof of your application submission.</p><p><strong>Application ID:</strong> {{QUIZ_SCORE}}</p><p><strong>Submitted:</strong> {{System.CurrentDate}}</p>',
        usedByPDFs: ['Job Applications', 'Program Applications']
      },
      {
        id: 37,
        name: 'Quiz Results Report',
        type: 'pdf' as const,
        context: 'pdf' as const,
        content: '<h1>Quiz Results Report</h1><h2>{{FORM_TITLE}}</h2><p><strong>Your Score:</strong> {{QUIZ_SCORE}} points</p><p><strong>Date Taken:</strong> {{System.CurrentDate}}</p><p>Detailed breakdown of your performance on each section.</p>',
        usedByPDFs: ['Knowledge Tests', 'Certification Exams']
      },
      {
        id: 38,
        name: 'Evaluation Summary',
        type: 'pdf' as const,
        context: 'pdf' as const,
        content: '<h1>Evaluation Summary</h1><h2>{{FORM_TITLE}}</h2><p>This document summarizes your evaluation results.</p><p><strong>Overall Score:</strong> {{QUIZ_SCORE}}</p><p>Recommendations and next steps are included below.</p>',
        usedByPDFs: ['Performance Reviews', 'Skills Assessments']
      },
      {
        id: 39,
        name: 'Completion Record',
        type: 'pdf' as const,
        context: 'pdf' as const,
        content: '<h1>Completion Record</h1><h2>{{FORM_TITLE}}</h2><p>This record confirms the successful completion of all requirements.</p><p><strong>Final Score:</strong> {{QUIZ_SCORE}}</p><p>Date of completion: {{System.CurrentDate}}</p>',
        usedByPDFs: ['Training Programs', 'Educational Courses']
      },
      {
        id: 40,
        name: 'Data Export Report',
        type: 'pdf' as const,
        context: 'pdf' as const,
        content: '<h1>Data Export Report</h1><h2>{{FORM_TITLE}}</h2><p>This report contains all exported data from your submission.</p><p><strong>Data Points:</strong> {{QUIZ_SCORE}}</p><p>Generated on: {{System.CurrentDate}}</p>',
        usedByPDFs: ['Data Analysis', 'Research Reports']
      }
    ];
  }

  if (context === 'email_campaign') {
    return [
      {
        id: 41,
        name: 'Client Promo Invite',
        type: 'email' as const,
        context: 'email_campaign' as const,
        content: '<h2>Special Promotion Just for You!</h2><p>Dear {{Contact.FirstName}},</p><p>We have an exclusive promotion available for our valued clients like you.</p><p>Use code SAVE20 to get 20% off your next appointment.</p><p>Best regards,<br>{{Company.Name}}</p>',
        subject: 'Exclusive Promotion for {{Contact.FirstName}}',
        usedByEmailCampaigns: ['Summer Sale Campaign', 'Client Appreciation']
      },
      {
        id: 42,
        name: 'Clinician July Update',
        type: 'email' as const,
        context: 'email_campaign' as const,
        content: '<h2>July Practice Update</h2><p>Dear {{Contact.FirstName}},</p><p>Here are the latest updates from our practice for July:</p><ul><li>New extended hours on weekends</li><li>Updated safety protocols</li><li>New telehealth options available</li></ul><p>Contact us at {{Company.Phone}} for more information.</p>',
        subject: 'July Practice Updates',
        usedByEmailCampaigns: ['Monthly Newsletter']
      },
      {
        id: 43,
        name: 'New Service Announcement',
        type: 'email' as const,
        context: 'email_campaign' as const,
        content: '<h2>Exciting New Service Available!</h2><p>Hello {{Contact.FirstName}},</p><p>We are thrilled to announce a new service that we believe will benefit you greatly.</p><p>Our new wellness program includes:</p><ul><li>Personalized nutrition planning</li><li>Stress management techniques</li><li>Regular progress monitoring</li></ul><p>Schedule your consultation today!</p>',
        subject: 'New Wellness Program Launch',
        usedByEmailCampaigns: ['Service Launch Campaign']
      },
      {
        id: 44,
        name: 'Appointment Reminder Campaign',
        type: 'email' as const,
        context: 'email_campaign' as const,
        content: '<h2>Don\'t Forget Your Upcoming Appointment</h2><p>Hi {{Contact.FirstName}},</p><p>This is a friendly reminder about your appointment:</p><p><strong>Date:</strong> {{Appointment.Date}}<br><strong>Time:</strong> {{Appointment.Time}}<br><strong>Provider:</strong> {{Appointment.ProviderName}}</p><p>If you need to reschedule, please call us at {{Company.Phone}}.</p>',
        subject: 'Appointment Reminder - {{Appointment.Date}}',
        usedByEmailCampaigns: ['Automated Reminders']
      },
      {
        id: 45,
        name: 'Welcome New Client',
        type: 'email' as const,
        context: 'email_campaign' as const,
        content: '<h2>Welcome to {{Company.Name}}!</h2><p>Dear {{Contact.FirstName}},</p><p>Welcome to our practice! We are excited to have you as part of our community.</p><p>Here are some helpful resources to get you started:</p><ul><li>Patient portal: {{Contact.ClientPortalURL}}</li><li>Our website: {{Company.Website}}</li><li>Contact information: {{Company.Phone}}</li></ul><p>We look forward to serving you!</p>',
        subject: 'Welcome to {{Company.Name}}, {{Contact.FirstName}}!',
        usedByEmailCampaigns: ['New Client Onboarding']
      },
      {
        id: 46,
        name: 'Health Tips Newsletter',
        type: 'email' as const,
        context: 'email_campaign' as const,
        content: '<h2>Monthly Health Tips</h2><p>Hello {{Contact.FirstName}},</p><p>Here are this month\'s health tips from our team:</p><ol><li><strong>Stay Hydrated:</strong> Aim for 8 glasses of water daily</li><li><strong>Regular Exercise:</strong> 30 minutes of activity most days</li><li><strong>Quality Sleep:</strong> 7-9 hours per night for optimal health</li></ol><p>Remember, small changes can make a big difference in your overall wellness.</p><p>Stay healthy,<br>The {{Company.Name}} Team</p>',
        subject: 'Your Monthly Health Tips from {{Company.Name}}',
        usedByEmailCampaigns: ['Monthly Newsletter', 'Health Education Series']
      },
      {
        id: 47,
        name: 'Satisfaction Survey Request',
        type: 'email' as const,
        context: 'email_campaign' as const,
        content: '<h2>We Value Your Feedback</h2><p>Dear {{Contact.FirstName}},</p><p>Your recent visit on {{Appointment.Date}} was important to us, and we would love to hear about your experience.</p><p>Please take a moment to complete our brief satisfaction survey. Your feedback helps us improve our services.</p><p><a href="#survey-link" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Take Survey</a></p><p>Thank you for choosing {{Company.Name}}!</p>',
        subject: 'How was your recent visit? Share your feedback',
        usedByEmailCampaigns: ['Post-Visit Follow-up', 'Quality Improvement']
      },
      {
        id: 48,
        name: 'Holiday Greetings',
        type: 'email' as const,
        context: 'email_campaign' as const,
        content: '<h2>Season\'s Greetings from {{Company.Name}}</h2><p>Dear {{Contact.FirstName}},</p><p>As we celebrate this holiday season, we want to express our gratitude for your trust in our services.</p><p>Our office will be closed from December 24th to January 2nd. For emergencies, please call {{Company.Phone}}.</p><p>Wishing you and your family a wonderful holiday season!</p>',
        subject: 'Holiday Greetings from {{Company.Name}}',
        usedByEmailCampaigns: ['Holiday Campaign', 'Year-End Messages']
      },
      {
        id: 49,
        name: 'Insurance Update Notice',
        type: 'email' as const,
        context: 'email_campaign' as const,
        content: '<h2>Important Insurance Information</h2><p>Dear {{Contact.FirstName}},</p><p>We wanted to inform you about important changes to insurance policies that may affect your coverage.</p><p>Please contact our billing department at {{Company.Phone}} to discuss how these changes might impact your future appointments.</p><p>We\'re here to help make this transition as smooth as possible.</p>',
        subject: 'Important Insurance Updates - Action Required',
        usedByEmailCampaigns: ['Insurance Notifications', 'Policy Updates']
      },
      {
        id: 50,
        name: 'Referral Program Launch',
        type: 'email' as const,
        context: 'email_campaign' as const,
        content: '<h2>Introducing Our Referral Program</h2><p>Dear {{Contact.FirstName}},</p><p>We\'re excited to launch our new referral program! When you refer friends or family members to {{Company.Name}}, both you and your referral receive special benefits.</p><p>Benefits include:</p><ul><li>$50 credit for each successful referral</li><li>Priority scheduling</li><li>Exclusive health resources</li></ul><p>Start referring today and help your loved ones discover quality care!</p>',
        subject: 'Earn Rewards with Our New Referral Program',
        usedByEmailCampaigns: ['Referral Campaign', 'Client Growth Initiative']
      }
    ];
  }
  
  return [];
};

export const createNewTemplate = (
  type: 'email' | 'sms' | 'aivoice' | 'knowledge' | 'confirmation' | 'pdf',
  context: 'calendar' | 'form' | 'confirmation' | 'pdf' | 'email_campaign',
  existingTemplates: any[]
) => {
  const contextTemplates = existingTemplates.filter(t => t.context === context);
  const templateType = context === 'confirmation' ? 'confirmation' : context === 'pdf' ? 'pdf' : type;
  
  return {
    id: Date.now(),
    name: `${templateType.charAt(0).toUpperCase() + templateType.slice(1)} Template ${contextTemplates.filter(t => t.type === templateType).length + 1}`,
    type: templateType as 'email' | 'sms' | 'aivoice' | 'knowledge' | 'confirmation' | 'pdf',
    context: context as 'calendar' | 'form' | 'confirmation' | 'pdf' | 'email_campaign',
    content: context === 'confirmation' ? 
      '<h2>Thank you!</h2><p>Your {{FORM_TITLE}} has been submitted successfully.</p><p>Score: {{QUIZ_SCORE}}</p>' :
      context === 'pdf' ?
      '<h1>PDF Document</h1><p>Form: {{FORM_TITLE}}</p><p>Score: {{QUIZ_SCORE}}</p><p>This PDF contains your form submission data.</p>' :
      context === 'email_campaign' ?
      '<h2>Email Campaign Template</h2><p>Dear {{Contact.FirstName}},</p><p>This is a sample email campaign template.</p><p>Best regards,<br>{{Company.Name}}</p>' :
      type === 'email' ? (context === 'calendar' ? 'Your appointment has been scheduled for {{Appointment.Date}} at {{Appointment.Time}}.' : 'Thank you for submitting {{FORM_TITLE}}. Your score: {{QUIZ_SCORE}}.') :
      type === 'sms' ? (context === 'calendar' ? 'Appointment reminder: {{Appointment.Date}} at {{Appointment.Time}}' : 'Your {{FORM_TITLE}} submission received. Score: {{QUIZ_SCORE}}.') :
      type === 'aivoice' ? (context === 'calendar' ? 'Hello! This is a reminder about your upcoming appointment on {{Appointment.Date}} at {{Appointment.Time}}.' : 'Hello! This is about your {{FORM_TITLE}} submission with score {{QUIZ_SCORE}}.') :
      context === 'calendar' ? 'Standard knowledge base content for calendar appointments.' : 'Standard knowledge base content for form submissions.',
    subject: type === 'email' ? (context === 'calendar' ? 'Appointment Confirmation' : context === 'form' ? 'Form Submission Confirmed' : context === 'email_campaign' ? 'Email Campaign Subject' : 'Confirmation') : '',
    voice: type === 'aivoice' ? 'kim' : '',
    knowledgeBase: type === 'aivoice' ? '' : '',
    usedByCalendars: context === 'calendar' ? [] : undefined,
    usedByForms: context === 'form' ? [] : undefined,
    usedByConfirmations: context === 'confirmation' ? [] : undefined,
    usedByPDFs: context === 'pdf' ? [] : undefined,
    usedByEmailCampaigns: context === 'email_campaign' ? [] : undefined
  };
};
