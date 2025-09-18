// Phone number formatting utilities by country

export const formatPhoneNumber = (phone: string, country: string = 'United States'): string => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  switch (country) {
    case 'United States':
    case 'Canada':
      return formatUSPhone(digitsOnly);
    
    case 'United Kingdom':
      return formatUKPhone(digitsOnly);
    
    case 'Australia':
      return formatAustralianPhone(digitsOnly);
    
    case 'Germany':
      return formatGermanPhone(digitsOnly);
    
    case 'France':
      return formatFrenchPhone(digitsOnly);
    
    default:
      // Generic international formatting with spaces
      return formatGenericPhone(digitsOnly);
  }
};

// US/Canada formatting: (123) 456-7890 or +1 (123) 456-7890
const formatUSPhone = (digits: string): string => {
  if (digits.length === 0) return '';
  
  // Handle country code
  if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.substring(1);
  }
  
  if (digits.length <= 3) {
    return `(${digits}`;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else if (digits.length <= 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};

// UK formatting: +44 20 1234 5678 or 020 1234 5678
const formatUKPhone = (digits: string): string => {
  if (digits.length === 0) return '';
  
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  } else if (digits.length <= 10) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
  } else {
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
  }
};

// Australian formatting: 04 1234 5678 or (02) 1234 5678
const formatAustralianPhone = (digits: string): string => {
  if (digits.length === 0) return '';
  
  // Mobile numbers (start with 04)
  if (digits.startsWith('04')) {
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
    }
  } else {
    // Landline numbers
    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
    }
  }
};

// German formatting: 030 12345678 or +49 30 12345678
const formatGermanPhone = (digits: string): string => {
  if (digits.length === 0) return '';
  
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 7) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  } else {
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }
};

// French formatting: 01 23 45 67 89
const formatFrenchPhone = (digits: string): string => {
  if (digits.length === 0) return '';
  
  const pairs = digits.match(/.{1,2}/g) || [];
  return pairs.join(' ').slice(0, 14); // Limit to 5 pairs (10 digits)
};

// Generic international formatting with spaces every 3-4 digits
const formatGenericPhone = (digits: string): string => {
  if (digits.length === 0) return '';
  
  // Add spaces every 3 digits for readability
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ');
};

// Get formatted phone number for display (used when not editing)
export const getFormattedPhoneDisplay = (phone: string, country: string = 'United States'): string => {
  if (!phone || phone.trim() === '') return '';
  
  // If already formatted, return as is
  if (phone.includes('(') || phone.includes('-') || phone.includes(' ')) {
    return phone;
  }
  
  return formatPhoneNumber(phone, country);
};