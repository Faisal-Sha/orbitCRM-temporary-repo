
import { format } from 'date-fns';

export const formatDateTime = (value: string, dateFormat: string = 'us', dateType: string = 'date') => {
  if (!value) return '';
  
  try {
    const date = new Date(value);
    
    if (dateType === 'time') {
      return format(date, 'h:mm a');
    }
    
    let dateFormatString = 'MMM dd, yyyy'; // US format
    if (dateFormat === 'uk') {
      dateFormatString = 'dd/MM/yyyy';
    } else if (dateFormat === 'iso') {
      dateFormatString = 'yyyy-MM-dd';
    }
    
    if (dateType === 'datetime') {
      const timeFormat = 'h:mm a';
      return `${format(date, dateFormatString)} ${format(date, timeFormat)}`;
    }
    
    return format(date, dateFormatString);
  } catch (error) {
    return value; // Return original value if formatting fails
  }
};
