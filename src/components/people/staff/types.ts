
export interface StaffMember {
  person_id: string;
  name: string;
  joinDate: string;
  contribution: string;
  email?: string;
  phone?: string;
  growthStage: "foundation" | "developing" | "established";
  status?: string;
  created_at?: string;
}

export interface Column {
  key: string;
  header: string;
  align: "left" | "center" | "right";
  width: string;
  cellClassName?: string;
  render?: (value: any, item: any) => JSX.Element;
}

export interface FilterOption {
  value: string;
  label: string;
}
