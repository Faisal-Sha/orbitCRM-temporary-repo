
import { format, subDays, startOfWeek, startOfMonth, startOfQuarter } from "date-fns";

// Types
export interface Appointment {
  id: string;
  clientName: string;
  providerName: string;
  type: 'Intakes' | 'Clients' | 'Team' | 'Personal';
  status: string;
  date: Date;
  duration: number;
  outcome?: string;
}

export interface ProviderStats {
  name: string;
  scheduled: number;
  followUps: number;
  completed: number;
  completionRate: number;
  contributionRate: number;
  avgDuration: number;
  referrals: number;
  referralRate: number;
}

export interface ClientStats {
  name: string;
  scheduled: number;
  completed: number;
  completionRate: number;
  contributionRate: number;
}

export const generateDummyAppointments = (): Appointment[] => {
  const appointments: Appointment[] = [];
  const providers = ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez', 'Dr. James Wilson', 'Dr. Lisa Thompson'];
  const clients = ['John Smith', 'Maria Garcia', 'David Lee', 'Sarah Brown', 'Michael Johnson', 'Emma Davis', 'Robert Wilson', 'Jennifer Martinez'];
  const intakeStatuses = ['Pending', 'New Client', 'No Show', 'Rescheduled', 'Canceled', 'Doubtful', 'Not Eligible', 'Unsubscribe'];
  const clientStatuses = ['Success', 'No Answer', 'Rescheduled', 'Canceled'];
  
  for (let i = 0; i < 150; i++) {
    const type = ['Intakes', 'Clients', 'Team', 'Personal'][Math.floor(Math.random() * 4)] as Appointment['type'];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    let status = 'Pending';
    if (type === 'Intakes') {
      status = intakeStatuses[Math.floor(Math.random() * intakeStatuses.length)];
    } else if (type === 'Clients') {
      status = clientStatuses[Math.floor(Math.random() * clientStatuses.length)];
    } else {
      status = ['Scheduled', 'Completed', 'Canceled'][Math.floor(Math.random() * 3)];
    }

    appointments.push({
      id: `app-${i}`,
      clientName: clients[Math.floor(Math.random() * clients.length)],
      providerName: providers[Math.floor(Math.random() * providers.length)],
      type,
      status,
      date,
      duration: 30 + Math.floor(Math.random() * 60),
      outcome: Math.random() > 0.3 ? status : undefined
    });
  }
  return appointments;
};

export const filterAppointments = (allAppointments: Appointment[], appointmentType: string, selectedProvider: string, dateRange: string) => {
  let filtered = allAppointments.filter(app => app.type === appointmentType);
  
  if (selectedProvider !== 'All Providers' && appointmentType === 'Intakes') {
    filtered = filtered.filter(app => app.providerName === selectedProvider);
  }

  const today = new Date();
  switch (dateRange) {
    case 'Today':
      filtered = filtered.filter(app => 
        app.date.toDateString() === today.toDateString()
      );
      break;
    case 'This Week':
      const weekStart = startOfWeek(today);
      filtered = filtered.filter(app => app.date >= weekStart);
      break;
    case 'Last Week':
      const lastWeekStart = startOfWeek(subDays(today, 7));
      const lastWeekEnd = subDays(startOfWeek(today), 1);
      filtered = filtered.filter(app => 
        app.date >= lastWeekStart && app.date <= lastWeekEnd
      );
      break;
    case 'This Month':
      const monthStart = startOfMonth(today);
      filtered = filtered.filter(app => app.date >= monthStart);
      break;
    case 'Last Month':
      const lastMonthStart = startOfMonth(subDays(startOfMonth(today), 1));
      const lastMonthEnd = subDays(startOfMonth(today), 1);
      filtered = filtered.filter(app => 
        app.date >= lastMonthStart && app.date <= lastMonthEnd
      );
      break;
    case 'This Quarter':
      const quarterStart = startOfQuarter(today);
      filtered = filtered.filter(app => app.date >= quarterStart);
      break;
    case 'Last Quarter':
      const lastQuarterStart = startOfQuarter(subDays(startOfQuarter(today), 1));
      const lastQuarterEnd = subDays(startOfQuarter(today), 1);
      filtered = filtered.filter(app => 
        app.date >= lastQuarterStart && app.date <= lastQuarterEnd
      );
      break;
  }
  
  return filtered;
};

export const calculateKPIs = (filteredAppointments: Appointment[]) => {
  const total = filteredAppointments.length;
  const completed = filteredAppointments.filter(app => 
    ['New Client', 'Success', 'Completed'].includes(app.status)
  ).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const avgDuration = total > 0 ? Math.round(
    filteredAppointments.reduce((sum, app) => sum + app.duration, 0) / total
  ) : 0;

  return { total, completed, completionRate, avgDuration };
};

export const generateAppointmentsOverTimeData = (dateRange: string, appointmentType: string) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    scheduled: Math.floor(Math.random() * 20) + 5,
    completed: Math.floor(Math.random() * 15) + 3
  }));
};

export const generateStatusBreakdownData = (filteredAppointments: Appointment[]) => {
  const statusCounts: Record<string, number> = {};
  filteredAppointments.forEach(app => {
    statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
  });
  
  const totalAppointments = filteredAppointments.length;
  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: totalAppointments > 0 ? Math.round((count / totalAppointments) * 100) : 0
  }));
};

export const generateProviderStats = (filteredAppointments: Appointment[], appointmentType: string): ProviderStats[] => {
  if (appointmentType !== 'Intakes') return [];
  
  const providers = ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez', 'Dr. James Wilson', 'Dr. Lisa Thompson'];
  return providers.map(name => {
    const providerApps = filteredAppointments.filter(app => app.providerName === name);
    const scheduled = providerApps.length;
    const completed = providerApps.filter(app => ['New Client', 'Success'].includes(app.status)).length;
    
    return {
      name,
      scheduled,
      followUps: Math.floor(scheduled * 0.3),
      completed,
      completionRate: scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0,
      contributionRate: filteredAppointments.length > 0 ? Math.round((scheduled / filteredAppointments.length) * 100) : 0,
      avgDuration: 45 + Math.floor(Math.random() * 30),
      referrals: Math.floor(Math.random() * 10),
      referralRate: Math.floor(Math.random() * 20) + 5
    };
  });
};

export const generateClientStats = (filteredAppointments: Appointment[], appointmentType: string): ClientStats[] => {
  if (appointmentType !== 'Clients') return [];
  
  const clients = ['John Smith', 'Maria Garcia', 'David Lee', 'Sarah Brown', 'Michael Johnson'];
  return clients.map(name => {
    const clientApps = filteredAppointments.filter(app => app.clientName === name);
    const scheduled = clientApps.length;
    const completed = clientApps.filter(app => app.status === 'Success').length;
    
    return {
      name,
      scheduled,
      completed,
      completionRate: scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0,
      contributionRate: filteredAppointments.length > 0 ? Math.round((scheduled / filteredAppointments.length) * 100) : 0
    };
  });
};

export const generatePendingAppointments = (filteredAppointments: Appointment[]) => {
  return filteredAppointments
    .filter(app => app.date < new Date() && (!app.outcome || app.outcome === 'Pending'))
    .slice(0, 5);
};
