
import { TableColumn } from "@/components/UserProfilePage";

export interface LeadData {
  id: string;
  name: string;
  inquiryDate: string;
  interest: string;
  email: string;
  phone: string;
  status?: string;
}

export interface NoShowData {
  name: string;
  inquiryDate: string;
  interest: string;
  email: string;
  phone: string;
  status?: string;
  person_id?: string;
}

export interface ReferralData {
  id: string;
  person_id: string;
  entryDate: string;
  interest: string;
  // Name, email, and phone will come from joining with people/people_contacts tables
  person?: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
  };
}

export interface FilterSearchBarProps {
  filterId: string;
  searchId: string;
  filterBy: string;
  setFilterBy: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterByOptions: { value: string; label: string }[];
}
