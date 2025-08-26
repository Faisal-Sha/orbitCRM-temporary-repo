
import { TableColumn } from "@/components/UserProfilePage";

export interface LeadData {
  name: string;
  inquiryDate: string;
  interest: string;
  email: string;
  phone: string;
}

export interface NoShowData {
  name: string;
  inquiryDate: string;
  interest: string;
  email: string;
  phone: string;
}

export interface ReferralData {
  name: string;
  entryDate: string;
  interest: string;
  email: string;
  phone: string;
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
