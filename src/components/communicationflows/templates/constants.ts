export const TEMPLATE_TYPES = {
  EMAIL: 'email',
  SMS: 'sms',
  AIVOICE: 'aivoice',
  KNOWLEDGE: 'knowledge',
  CONFIRMATION: 'confirmation',
  PDF: 'pdf'
} as const;

export const CONTEXTS = {
  CALENDAR: 'calendar',
  FORM: 'form',
  CONFIRMATION: 'confirmation',
  PDF: 'pdf'
} as const;

export const VOICE_OPTIONS = [
  { value: 'kim', label: 'Kim' },
  { value: 'aliyah', label: 'Aliyah' },
  { value: 'john', label: 'John' },
  { value: 'steve', label: 'Steve' }
];

export const getDefaultTemplates = (context: string) => {
  const calendarTemplates = [
    {
      id: 1,
      name: 'Appointment Confirmation Email',
      type: 'email',
      context: 'calendar',
      content: '<p>Dear {{name}},</p><p>Your appointment has been scheduled for {{Appointment.Date}} at {{Appointment.Time}}.</p><p>Best regards,<br>The Team</p>',
      subject: 'Appointment Confirmation',
      usedByCalendars: ['General Practice Calendar', 'Consultation Calendar']
    },
    {
      id: 2,
      name: 'Appointment Reminder SMS',
      type: 'sms',
      context: 'calendar',
      content: 'Hi {{name}}! Reminder: Your appointment is tomorrow at {{Appointment.Time}}. See you then!',
      usedByCalendars: ['General Practice Calendar']
    },
    {
      id: 3,
      name: 'Welcome Call Script',
      type: 'aivoice',
      context: 'calendar',
      content: 'Hello {{name}}, this is a reminder about your upcoming appointment on {{Appointment.Date}} at {{Appointment.Time}}. Please call us if you need to reschedule.',
      voice: 'kim',
      knowledgeBase: 'Our clinic is located at {{Appointment.Location}}. We offer comprehensive healthcare services.',
      usedByCalendars: ['Consultation Calendar', 'Follow-up Calendar']
    },
    {
      id: 4,
      name: 'Post-Appointment Follow-up',
      type: 'email',
      context: 'calendar',
      content: '<p>Thank you for your visit on {{Appointment.Date}}.</p><p>We hope you had a positive experience with our {{Appointment.Service}} service.</p>',
      subject: 'Thank you for your visit',
      usedByCalendars: ['General Practice Calendar', 'Specialist Calendar', 'Follow-up Calendar']
    },
    {
      id: 5,
      name: 'Cancellation Notice',
      type: 'email',
      context: 'calendar',
      content: '<p>Your appointment scheduled for {{Appointment.Date}} at {{Appointment.Time}} has been cancelled.</p>',
      subject: 'Appointment Cancelled',
      usedByCalendars: ['General Practice Calendar']
    },
    {
      id: 6,
      name: 'Reschedule Request SMS',
      type: 'sms',
      context: 'calendar',
      content: 'Please confirm if you can reschedule your appointment from {{Appointment.Date}} to a new time. Reply YES or NO.',
      usedByCalendars: ['General Practice Calendar', 'Consultation Calendar']
    },
    {
      id: 7,
      name: 'Standard Knowledge Base',
      type: 'knowledge',
      context: 'calendar',
      content: 'Our clinic hours are Monday-Friday 9AM-5PM. We provide comprehensive healthcare services including preventive care, diagnostics, and treatment planning.',
      usedByCalendars: ['General Practice Calendar', 'Consultation Calendar']
    }
  ];

  const formTemplates = [
    {
      id: 101,
      name: 'Form Submission Confirmation',
      type: 'email',
      context: 'form',
      content: '<p>Thank you for submitting {{FORM_TITLE}}.</p><p>Your quiz score: {{QUIZ_SCORE}}</p><p>We will review your information and get back to you soon.</p>',
      subject: 'Form Submission Received',
      usedByForms: ['Contact Form', 'Registration Form']
    },
    {
      id: 102,
      name: 'Welcome SMS',
      type: 'sms',
      context: 'form',
      content: 'Welcome! Your {{FORM_TITLE}} has been received. Your score: {{QUIZ_SCORE}}. Thank you!',
      usedByForms: ['Quiz Form', 'Assessment Form']
    },
    {
      id: 103,
      name: 'Follow-up Call Script',
      type: 'aivoice',
      context: 'form',
      content: 'Hello! This is a follow-up call regarding your {{FORM_TITLE}} submission. Your quiz score was {{QUIZ_SCORE}}.',
      voice: 'kim',
      knowledgeBase: 'We provide personalized follow-up based on form submissions and quiz results.',
      usedByForms: ['Assessment Form', 'Evaluation Form']
    },
    {
      id: 104,
      name: 'High Score Congratulations',
      type: 'email',
      context: 'form',
      content: '<p>Congratulations! You scored {{QUIZ_SCORE}} on {{FORM_TITLE}}.</p><p>This is an excellent result!</p>',
      subject: 'Great Job on Your Quiz!',
      usedByForms: ['Knowledge Quiz', 'Assessment Form']
    },
    {
      id: 105,
      name: 'Incomplete Form Reminder',
      type: 'sms',
      context: 'form',
      content: 'Hi! It looks like you started {{FORM_TITLE}} but didn\'t finish. Would you like to complete it?',
      usedByForms: ['Registration Form', 'Survey Form']
    },
    {
      id: 106,
      name: 'Form Completion Certificate',
      type: 'email',
      context: 'form',
      content: '<p>Congratulations on completing {{FORM_TITLE}}!</p><p>Your final score: {{QUIZ_SCORE}}</p><p>Please find your certificate attached.</p>',
      subject: 'Your Completion Certificate',
      usedByForms: ['Training Form', 'Certification Quiz']
    },
    {
      id: 107,
      name: 'Form Knowledge Base',
      type: 'knowledge',
      context: 'form',
      content: 'Our forms are designed to collect important information efficiently. Quiz scores help us understand your knowledge level and provide personalized recommendations.',
      usedByForms: ['All Forms']
    }
  ];

  const confirmationTemplates = [
    {
      id: 201,
      name: 'Thank You Message',
      type: 'confirmation',
      context: 'confirmation',
      content: '<h2>Thank you for your submission!</h2><p>We have received your {{FORM_TITLE}} and will review it shortly.</p><p>Your submission score: {{QUIZ_SCORE}}</p>',
      usedByConfirmations: ['Contact Form Confirmation', 'Registration Confirmation']
    },
    {
      id: 202,
      name: 'High Score Congratulations',
      type: 'confirmation',
      context: 'confirmation',
      content: '<h2>Congratulations!</h2><p>You achieved an excellent score of {{QUIZ_SCORE}} on {{FORM_TITLE}}!</p><p>We will be in touch soon with next steps.</p>',
      usedByConfirmations: ['Quiz Completion', 'Assessment Results']
    },
    {
      id: 203,
      name: 'Payment Success',
      type: 'confirmation',
      context: 'confirmation',
      content: '<h2>Payment Confirmed</h2><p>Thank you for your payment! Your {{FORM_TITLE}} has been successfully processed.</p><p>A receipt will be sent to your email shortly.</p>',
      usedByConfirmations: ['Payment Form', 'Checkout Process']
    },
    {
      id: 204,
      name: 'Appointment Scheduled',
      type: 'confirmation',
      context: 'confirmation',
      content: '<h2>Appointment Confirmed</h2><p>Your appointment request from {{FORM_TITLE}} has been received.</p><p>We will contact you within 24 hours to confirm your preferred time slot.</p>',
      usedByConfirmations: ['Appointment Request', 'Booking Form']
    },
    {
      id: 205,
      name: 'Application Received',
      type: 'confirmation',
      context: 'confirmation',
      content: '<h2>Application Submitted</h2><p>Thank you for submitting your {{FORM_TITLE}}.</p><p>Your application is now under review. You should hear back from us within 5-7 business days.</p>',
      usedByConfirmations: ['Job Application', 'Program Application']
    },
    {
      id: 206,
      name: 'Survey Complete',
      type: 'confirmation',
      context: 'confirmation',
      content: '<h2>Survey Completed</h2><p>Thank you for participating in our {{FORM_TITLE}}.</p><p>Your feedback score: {{QUIZ_SCORE}}</p><p>Your input helps us improve our services.</p>',
      usedByConfirmations: ['Customer Survey', 'Feedback Form']
    },
    {
      id: 207,
      name: 'Document Download',
      type: 'confirmation',
      context: 'confirmation',
      content: '<h2>Download Ready</h2><p>Your {{FORM_TITLE}} has been processed.</p><p>Your documents are ready for download below.</p><p><a href="#" onclick="downloadPDF(\'doc1\')">Download Certificate</a></p>',
      usedByConfirmations: ['Certificate Request', 'Document Form']
    }
  ];

  const pdfTemplates = [
    {
      id: 301,
      name: 'Client Application PDF',
      type: 'pdf',
      context: 'pdf',
      content: '<h1>Client Application</h1><p>Form: {{FORM_TITLE}}</p><p>Score: {{QUIZ_SCORE}}</p><p>This PDF contains your form submission data.</p>',
      usedByPDFs: ['Application Form PDF', 'Registration PDF']
    },
    {
      id: 302,
      name: 'Clinician Onboarding PDF',
      type: 'pdf',
      context: 'pdf',
      content: '<h1>Clinician Onboarding Document</h1><p>Welcome to our team!</p><p>Form: {{FORM_TITLE}}</p><p>Assessment Score: {{QUIZ_SCORE}}</p><p>This document outlines your onboarding process.</p>',
      usedByPDFs: ['Onboarding Form PDF', 'Staff Assessment PDF']
    },
    {
      id: 303,
      name: 'Payment Confirmation PDF',
      type: 'pdf',
      context: 'pdf',
      content: '<h1>Payment Receipt</h1><p>Thank you for your payment!</p><p>Form: {{FORM_TITLE}}</p><p>Transaction completed successfully.</p>',
      usedByPDFs: ['Payment Form PDF', 'Invoice PDF']
    },
    {
      id: 304,
      name: 'Assessment Report PDF',
      type: 'pdf',
      context: 'pdf',
      content: '<h1>Assessment Report</h1><p>Client Assessment: {{FORM_TITLE}}</p><p>Overall Score: {{QUIZ_SCORE}}</p><p>This report summarizes the assessment results and recommendations.</p>',
      usedByPDFs: ['Assessment Form PDF', 'Evaluation PDF']
    },
    {
      id: 305,
      name: 'Training Certificate PDF',
      type: 'pdf',
      context: 'pdf',
      content: '<h1>Certificate of Completion</h1><p>Training Program: {{FORM_TITLE}}</p><p>Final Score: {{QUIZ_SCORE}}</p><p>This certifies successful completion of the training program.</p>',
      usedByPDFs: ['Training Form PDF', 'Certification PDF']
    },
    {
      id: 306,
      name: 'Medical Record PDF',
      type: 'pdf',
      context: 'pdf',
      content: '<h1>Medical Record Summary</h1><p>Patient Form: {{FORM_TITLE}}</p><p>Health Score: {{QUIZ_SCORE}}</p><p>This document contains the patient\'s medical information and history.</p>',
      usedByPDFs: ['Medical Form PDF', 'Health Assessment PDF']
    },
    {
      id: 307,
      name: 'Legal Document PDF',
      type: 'pdf',
      context: 'pdf',
      content: '<h1>Legal Documentation</h1><p>Document Type: {{FORM_TITLE}}</p><p>Compliance Score: {{QUIZ_SCORE}}</p><p>This is a legally binding document based on the submitted information.</p>',
      usedByPDFs: ['Legal Form PDF', 'Compliance PDF']
    }
  ];

  return context === 'calendar' ? calendarTemplates : 
         context === 'form' ? formTemplates : 
         context === 'confirmation' ? confirmationTemplates : pdfTemplates;
};