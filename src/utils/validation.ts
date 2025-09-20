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
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    return hostname.includes('facebook.com') || hostname.includes('fb.com');
  } catch {
    return false; // Invalid URL format
  }
};

export const validateInstagramUrl = (url: string): boolean => {
  if (!url.trim()) return true; // Empty URLs are allowed
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.toLowerCase().includes('instagram.com');
  } catch {
    return false; // Invalid URL format
  }
};

export const validateTikTokUrl = (url: string): boolean => {
  if (!url.trim()) return true; // Empty URLs are allowed
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.toLowerCase().includes('tiktok.com');
  } catch {
    return false; // Invalid URL format
  }
};

export const validateLinkedInUrl = (url: string): boolean => {
  if (!url.trim()) return true; // Empty URLs are allowed
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.toLowerCase().includes('linkedin.com');
  } catch {
    return false; // Invalid URL format
  }
};

// Get validation error message for URLs
export const getUrlValidationError = (url: string, platform: string): string | null => {
  if (!url.trim()) return null;
  
  switch (platform) {
    case 'facebook':
      return validateFacebookUrl(url) ? null : 'Please enter a valid Facebook URL (e.g., https://facebook.com/username)';
    case 'instagram':
      return validateInstagramUrl(url) ? null : 'Please enter a valid Instagram URL (e.g., https://instagram.com/username)';
    case 'tiktok':
      return validateTikTokUrl(url) ? null : 'Please enter a valid TikTok URL (e.g., https://tiktok.com/@username)';
    case 'linkedin':
      return validateLinkedInUrl(url) ? null : 'Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)';
    default:
      return null;
  }
};