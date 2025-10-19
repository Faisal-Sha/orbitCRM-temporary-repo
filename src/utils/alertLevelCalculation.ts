export interface AlertData {
  totalAppointments: number;
  totalRescheduled: number;
  isClient: boolean;
}

export type AlertLevel = 'grey' | 'yellow' | 'red';

export const calculateAlertLevel = (data: AlertData): AlertLevel => {
  const { totalAppointments, totalRescheduled, isClient } = data;
  
  // Red alert conditions
  if (
    totalAppointments >= 5 ||
    totalRescheduled >= 4 ||
    isClient
  ) {
    return 'red';
  }
  
  // Yellow alert conditions
  if (
    (totalAppointments >= 3 && totalAppointments <= 4) ||
    (totalRescheduled >= 2 && totalRescheduled <= 3)
  ) {
    return 'yellow';
  }
  
  // Grey alert (default)
  return 'grey';
};

export const formatAlertTooltipData = (data: AlertData) => {
  const { totalAppointments, totalRescheduled, isClient } = data;
  
  return [
    {
      label: 'Appointments',
      value: totalAppointments.toString(),
      color: totalAppointments >= 3 ? 'text-red-600' : ''
    },
    {
      label: 'Rescheduled',
      value: totalRescheduled.toString(),
      color: totalRescheduled >= 2 ? 'text-red-600' : ''
    },
    {
      label: 'Client',
      value: isClient ? 'Yes' : 'No',
      color: isClient ? 'text-red-600' : ''
    }
  ];
};
