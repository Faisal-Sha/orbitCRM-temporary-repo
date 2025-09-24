export interface StatusLabelConfig {
  backgroundColor: string;
  textColor: string;
  fontWeight: string;
}

export const getStatusLabelConfig = (status: string): StatusLabelConfig => {
  const normalizedStatus = status?.toLowerCase().trim();

  // Yellow Labels - Applied, On Hold statuses
  if (['applied', 'on hold'].includes(normalizedStatus)) {
    return {
      backgroundColor: '#fef9c3',
      textColor: 'black',
      fontWeight: '500'
    };
  }

  // Green Labels - Active, Qualified statuses
  if (['active', 'qualified'].includes(normalizedStatus)) {
    return {
      backgroundColor: '#dcfce7',
      textColor: 'black',
      fontWeight: '500'
    };
  }

  // Red Labels - Inactive/negative statuses
  if (['inactive', 'terminated', 'canceled', 'discharged', 'deceased'].includes(normalizedStatus)) {
    return {
      backgroundColor: '#fdd3eb',
      textColor: 'black',
      fontWeight: '500'
    };
  }

  // Default gray for unmapped statuses
  return {
    backgroundColor: '#ededed',
    textColor: 'black',
    fontWeight: 'normal'
  };
};