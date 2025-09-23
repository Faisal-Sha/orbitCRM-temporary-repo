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
      backgroundColor: 'hsl(var(--yellow) / 0.1)',
      textColor: 'hsl(var(--yellow-foreground))',
      fontWeight: '500'
    };
  }

  // Green Labels - Active, Qualified statuses
  if (['active', 'qualified'].includes(normalizedStatus)) {
    return {
      backgroundColor: 'hsl(var(--green) / 0.1)',
      textColor: 'hsl(var(--green-foreground))',
      fontWeight: '500'
    };
  }

  // Red Labels - Inactive/negative statuses
  if (['inactive', 'terminated', 'canceled', 'discharged', 'deceased'].includes(normalizedStatus)) {
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