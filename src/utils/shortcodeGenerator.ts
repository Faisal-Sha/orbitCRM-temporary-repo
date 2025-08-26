
import React from 'react';
import { Button } from '@/components/ui/button';
import { EmailCampaignShortcodes } from '@/components/texteditor/components/EmailCampaignShortcodes';

export interface CustomField {
  label?: string;
  id?: string;
  [key: string]: any;
}

// Add function to get shortcode categories for modern UI (email campaigns, email automation, SMS automation, SMS campaigns, and call automation)
export const getShortcodeCategories = (context: 'calendar' | 'form' | 'confirmation' | 'pdf' | 'email_campaign' | 'email_automation' | 'sms_automation' | 'call_automation' | 'sms_campaign' = 'calendar') => {
  if (context === 'email_campaign' || context === 'email_automation' || context === 'sms_automation' || context === 'call_automation' || context === 'sms_campaign') {
    return {
      'Contact Information': [
        '{{Contact.ID}}', '{{Contact.FirstName}}', '{{Contact.LastName}}', 
        '{{Contact.FullName}}', '{{Contact.Email}}', '{{Contact.Phone}}', 
        '{{Contact.MobilePhone}}', '{{Contact.Address}}', '{{Contact.City}}', 
        '{{Contact.State}}', '{{Contact.ZipCode}}', '{{Contact.DateOfBirth}}', 
        '{{Contact.Gender}}', '{{Contact.LeadSource}}', '{{Contact.ClientPortalURL}}'
      ],
      'Company Information': [
        '{{Company.Name}}', '{{Company.Phone}}', '{{Company.Email}}', 
        '{{Company.Address}}', '{{Company.Website}}', '{{Company.LogoURL}}', 
        '{{Company.PrivacyURL}}', '{{Company.TermsURL}}'
      ],
      'Appointment Information': [
        '{{Appointment.Date}}', '{{Appointment.Time}}', '{{Appointment.DateTime}}', 
        '{{Appointment.Calendar}}', '{{Appointment.Type}}', '{{Appointment.Duration}}', 
        '{{Appointment.Location}}', '{{Appointment.ProviderName}}', '{{Appointment.JoinURL}}', 
        '{{Appointment.ConfirmationURL}}', '{{Appointment.RescheduleURL}}', 
        '{{Appointment.CancelURL}}', '{{Appointment.LastDate}}', '{{Appointment.NextDate}}'
      ],
      'Form/Survey Data': [
        '{{Form.SurveyName}}', '{{Form.SurveyDate}}', '{{Form.SurveyResult}}', 
        '{{Form.QuizName}}', '{{Form.QuizDate}}', '{{Form.QuizResult}}'
      ],
      'System Values': [
        '{{System.CurrentDate}}', '{{System.CurrentTime}}', 
        '{{System.UnsubscribeLink}}', '{{System.LoginURL}}'
      ]
    };
  }
  
  return {};
};

export const generateShortcodes = (
  customFields: CustomField[] = [], 
  context: 'calendar' | 'form' | 'confirmation' | 'pdf' | 'email_campaign' | 'email_automation' | 'sms_automation' | 'call_automation' | 'sms_campaign' = 'calendar', 
  formData?: any
): string[] => {
  if (context === 'email_campaign' || context === 'email_automation' || context === 'sms_automation' || context === 'call_automation' || context === 'sms_campaign') {
    // Email campaign, email automation, SMS automation, SMS campaigns, and call automation specific shortcodes with categories
    return [
      // Contact Information
      '{{Contact.ID}}',
      '{{Contact.FirstName}}',
      '{{Contact.LastName}}',
      '{{Contact.FullName}}',
      '{{Contact.Email}}',
      '{{Contact.Phone}}',
      '{{Contact.MobilePhone}}',
      '{{Contact.Address}}',
      '{{Contact.City}}',
      '{{Contact.State}}',
      '{{Contact.ZipCode}}',
      '{{Contact.DateOfBirth}}',
      '{{Contact.Gender}}',
      '{{Contact.LeadSource}}',
      '{{Contact.ClientPortalURL}}',
      
      // Company/Organization Information
      '{{Company.Name}}',
      '{{Company.Phone}}',
      '{{Company.Email}}',
      '{{Company.Address}}',
      '{{Company.Website}}',
      '{{Company.LogoURL}}',
      '{{Company.PrivacyURL}}',
      '{{Company.TermsURL}}',
      
      // Appointment/Schedule Information
      '{{Appointment.Date}}',
      '{{Appointment.Time}}',
      '{{Appointment.DateTime}}',
      '{{Appointment.Calendar}}',
      '{{Appointment.Type}}',
      '{{Appointment.Duration}}',
      '{{Appointment.Location}}',
      '{{Appointment.ProviderName}}',
      '{{Appointment.JoinURL}}',
      '{{Appointment.ConfirmationURL}}',
      '{{Appointment.RescheduleURL}}',
      '{{Appointment.CancelURL}}',
      '{{Appointment.LastDate}}',
      '{{Appointment.NextDate}}',
      
      // Form/Survey Submission Data
      '{{Form.SurveyName}}',
      '{{Form.SurveyDate}}',
      '{{Form.SurveyResult}}',
      
      // Form/Quiz Submission Data
      '{{Form.QuizName}}',
      '{{Form.QuizDate}}',
      '{{Form.QuizResult}}',
      
      // System/Dynamic Values
      '{{System.CurrentDate}}',
      '{{System.CurrentTime}}',
      '{{System.UnsubscribeLink}}',
      '{{System.LoginURL}}'
    ];
  } else if (context === 'calendar') {
    const appointmentShortcodes = [
      '{{Appointment.Date}}',
      '{{Appointment.Time}}',
      '{{Appointment.Service}}',
      '{{Appointment.Location}}',
      '{{Appointment.ProviderName}}'
    ];
    
    const customFieldShortcodes = customFields.map(field => 
      `{{${field.label?.replace(/\s+/g, '_') || 'field'}}}`
    );
    
    return [...appointmentShortcodes, ...customFieldShortcodes];
  } else if (context === 'form' || context === 'confirmation' || context === 'pdf') {
    // Form, confirmation, and PDF contexts use the same shortcodes
    const formShortcodes = ['{{FORM_TITLE}}', '{{QUIZ_SCORE}}'];
    
    if (formData?.steps) {
      formData.steps.forEach((step: any, stepIndex: number) => {
        step.elements?.forEach((element: any, elementIndex: number) => {
          if (!['next', 'previous', 'save', 'submit', 'linebreak'].includes(element.type)) {
            // Include hidden fields with data sources in shortcodes
            const shortcodeName = element.label?.toLowerCase().replace(/\s+/g, '_') || `field_${stepIndex}_${elementIndex}`;
            formShortcodes.push(`{{${shortcodeName}}}`);
          }
        });
      });
    }
    
    return formShortcodes;
  }
  
  return [];
};

// New function to generate the shortcode component
export const generateShortcodeComponent = (
  availableShortcodes: string[],
  actions: { insertShortcode: (shortcode: string) => void },
  context: 'calendar' | 'form' | 'confirmation' | 'pdf' | 'email_campaign' | 'email_automation' | 'sms_automation' | 'call_automation' | 'sms_campaign' = 'calendar',
  onUpdate?: (updates: any) => void,
  currentContent?: string
) => {
  if (availableShortcodes.length === 0) return null;

  // For email campaign, email automation, SMS automation, SMS campaigns, and call automation contexts, render the proper React component
  if (context === 'email_campaign' || context === 'email_automation' || context === 'sms_automation' || context === 'call_automation' || context === 'sms_campaign') {
    return React.createElement(EmailCampaignShortcodes, {
      onInsertShortcode: actions.insertShortcode
    });
  }

  // For all other contexts, render simple button layout
  return React.createElement('div', { className: 'space-y-2' },
    React.createElement('label', { className: 'text-sm font-medium' }, 'Available Shortcodes:'),
    React.createElement('div', { className: 'flex flex-wrap gap-2' },
      availableShortcodes.map((shortcode) =>
        React.createElement(Button, {
          key: shortcode,
          type: 'button',
          variant: 'outline',
          size: 'sm',
          onClick: () => actions.insertShortcode(shortcode),
          className: 'text-xs'
        }, shortcode)
      )
    )
  );
};
