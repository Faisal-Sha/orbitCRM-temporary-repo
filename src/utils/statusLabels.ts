export interface StatusLabelConfig {
  backgroundColor: string;
  textColor: string;
  fontWeight: string;
}

export const getStatusLabelConfig = (status: string): StatusLabelConfig => {
  const normalizedStatus = status?.toLowerCase().trim();

  // Yellow Labels
  if (['applied', 'on hold', 'onboarding', 'on leave', 'doubtful'].includes(normalizedStatus)) {
    return {
      backgroundColor: 'hsl(var(--yellow) / 0.1)',
      textColor: 'hsl(var(--yellow-foreground))',
      fontWeight: '500'
    };
  }

  // Green Labels  
  if (['active', 'qualified', 'scheduled', 'rescheduled'].includes(normalizedStatus)) {
    return {
      backgroundColor: 'hsl(var(--green) / 0.1)',
      textColor: 'hsl(var(--green-foreground))',
      fontWeight: '500'
    };
  }

  // Red Labels
  if (['inactive', 'unqualified', 'unsubscribed', 'discharged', 'deceased', 'terminated', 'canceled', 'no show'].includes(normalizedStatus)) {
    return {
      backgroundColor: 'hsl(var(--destructive) / 0.1)',
      textColor: 'hsl(var(--destructive-foreground))',
      fontWeight: '500'
    };
  }

  // Default gray for unmapped statuses
  return {
    backgroundColor: 'hsl(var(--muted))',
    textColor: 'hsl(var(--muted-foreground))',
    fontWeight: '500'
  };
};