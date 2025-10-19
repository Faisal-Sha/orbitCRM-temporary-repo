
export interface Appointment {
  id: string;
  groupDate: string;
  groupDateDisplay: string;
  time: string;
  isTimeRange: boolean;
  type: "intakes" | "clients" | "team" | "personal";
  service: string;
  clientFullName: string;
  clinicianFullName: string;
  meetingTitle?: string;
  numberOfInvitees: number;
  attendees: string[];
  alertLevel: "red" | "yellow" | "grey";
  note?: string;
  attendeeNote?: string;
  email: string;
  phone: string;
  growthStage: "foundation" | "developing" | "established";
  outcome: string;
  cancellationReason?: string;
  description?: string;
  location?: string;
  address?: string;
  otherDetails?: string;
  callLogs?: boolean[];
  startMs: number;
  startISO?: string;
  rescheduleReasons?: string[];
  meetingUrl?: string;
  attendeeId?: string;
  appointmentId?: string;
}

export interface FilterOptions {
  value: string;
  label: string;
}
