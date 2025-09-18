export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePhoneNumber = (phone: string, country: string = 'United States'): boolean => {
  if (!phone || phone.trim().length === 0) return true; // Allow empty values
  
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  switch (country.toLowerCase()) {
    case 'united states':
    case 'usa':
    case 'us':
      // US phone numbers should have 10 digits
      return cleanPhone.length === 10;
    case 'canada':
      // Canada uses same format as US
      return cleanPhone.length === 10;
    case 'united kingdom':
    case 'uk':
      // UK phone numbers can vary, typically 10-11 digits
      return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    default:
      // For other countries, allow 7-15 digits (international standard)
      return cleanPhone.length >= 7 && cleanPhone.length <= 15;
  }
};