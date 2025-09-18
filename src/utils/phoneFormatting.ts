export const formatPhoneNumber = (phone: string, country: string = 'United States'): string => {
  if (!phone) return '';
  
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  switch (country.toLowerCase()) {
    case 'united states':
    case 'usa':
    case 'us':
    case 'canada':
      if (cleanPhone.length === 10) {
        return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
      }
      break;
    case 'united kingdom':
    case 'uk':
      if (cleanPhone.length === 10) {
        return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7)}`;
      } else if (cleanPhone.length === 11) {
        return `${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5, 8)} ${cleanPhone.slice(8)}`;
      }
      break;
    default:
      // For other countries, add spaces every 3-4 digits
      if (cleanPhone.length >= 7) {
        const groups = cleanPhone.match(/.{1,3}/g) || [];
        return groups.join(' ');
      }
      break;
  }
  
  return phone; // Return original if no formatting rule applies
};