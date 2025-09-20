// Email validation utility
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Phone number validation by country
export const validatePhoneNumber = (phone: string, country: string = 'United States'): boolean => {
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  switch (country) {
    case 'United States':
    case 'Canada':
      // US/Canada: 10 digits (with or without country code)
      return digitsOnly.length === 10 || (digitsOnly.length === 11 && digitsOnly.startsWith('1'));
    
    case 'United Kingdom':
      // UK: 10-11 digits
      return digitsOnly.length >= 10 && digitsOnly.length <= 11;
    
    case 'Australia':
      // Australia: 9-10 digits (mobile starts with 04, landlines vary)
      return digitsOnly.length >= 9 && digitsOnly.length <= 10;
    
    case 'Germany':
      // Germany: 10-12 digits
      return digitsOnly.length >= 10 && digitsOnly.length <= 12;
    
    case 'France':
      // France: 10 digits
      return digitsOnly.length === 10;
    
    default:
      // Generic international: 7-15 digits
      return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  }
};

// Get validation error message for email
export const getEmailValidationError = (email: string): string | null => {
  if (!email.trim()) return null;
  return validateEmail(email) ? null : 'Please enter a valid email address';
};

// Get validation error message for phone
export const getPhoneValidationError = (phone: string, country: string = 'United States'): string | null => {
  if (!phone.trim()) return null;
  return validatePhoneNumber(phone, country) ? null : `Please enter a valid ${country} phone number`;
};

// URL validation functions for social media platforms
export const validateFacebookUrl = (url: string): boolean => {
  if (!url.trim()) return true; // Empty URLs are allowed
  const urlLower = url.toLowerCase();
  return urlLower.includes('facebook.com') || urlLower.includes('fb.com');
};

export const validateInstagramUrl = (url: string): boolean => {
  if (!url.trim()) return true; // Empty URLs are allowed
  return url.toLowerCase().includes('instagram.com');
};

export const validateTikTokUrl = (url: string): boolean => {
  if (!url.trim()) return true; // Empty URLs are allowed
  return url.toLowerCase().includes('tiktok.com');
};

export const validateLinkedInUrl = (url: string): boolean => {
  if (!url.trim()) return true; // Empty URLs are allowed
  return url.toLowerCase().includes('linkedin.com');
};

// Get validation error message for URLs
export const getUrlValidationError = (url: string, platform: string): string | null => {
  if (!url.trim()) return null;
  
  switch (platform) {
    case 'facebook':
      return validateFacebookUrl(url) ? null : 'Please enter a valid Facebook URL (must contain facebook.com or fb.com)';
    case 'instagram':
      return validateInstagramUrl(url) ? null : 'Please enter a valid Instagram URL (must contain instagram.com)';
    case 'tiktok':
      return validateTikTokUrl(url) ? null : 'Please enter a valid TikTok URL (must contain tiktok.com)';
    case 'linkedin':
      return validateLinkedInUrl(url) ? null : 'Please enter a valid LinkedIn URL (must contain linkedin.com)';
    default:
      return null;
  }
};