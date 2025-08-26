
export interface StaffMember {
  name: string;
  joinDate: string;
  contribution: string;
  email: string;
  phone: string;
  growthStage: "foundation" | "developing" | "established";
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
