
export interface ClientData {
  person_id?: string;
  name: string;
  dateStarted?: string;
  dateDischarged?: string;
  dateFlagged?: string;
  provider: string;
  email: string;
  phone: string;
  growthStage: string;
}

export interface FilterByOption {
  value: string;
  label: string;
}
