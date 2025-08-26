
import { StaffMember, FilterOption } from "./types";

export const generateActiveStaffData = (): StaffMember[] => [
  {
    name: "Amanda Lee",
    joinDate: "May 12, 2021",
    contribution: "84%",
    email: "amanda.lee@email.com",
    phone: "211-345-9821",
    growthStage: "established",
  },
  {
    name: "Carlos Diaz",
    joinDate: "Sep 9, 2022",
    contribution: "72%",
    email: "carlos.diaz@email.com",
    phone: "543-123-6542",
    growthStage: "developing",
  },
  {
    name: "Sandy Brooks",
    joinDate: "Feb 18, 2023",
    contribution: "65%",
    email: "sandy.brooks@email.com",
    phone: "455-253-9661",
    growthStage: "foundation",
  },
  {
    name: "Priya Shah",
    joinDate: "Mar 01, 2022",
    contribution: "90%",
    email: "priya.shah@email.com",
    phone: "342-857-4691",
    growthStage: "established",
  },
  {
    name: "Tom Garner",
    joinDate: "Aug 15, 2021",
    contribution: "59%",
    email: "tom.garner@email.com",
    phone: "666-271-3940",
    growthStage: "developing",
  },
];

export const generateInactiveStaffData = (): StaffMember[] => [
  {
    name: "Jordan King",
    joinDate: "Jun 21, 2020",
    contribution: "43%",
    email: "jordan.king@email.com",
    phone: "901-342-8569",
    growthStage: "foundation",
  },
  {
    name: "Eva Tran",
    joinDate: "Nov 7, 2019",
    contribution: "62%",
    email: "eva.tran@email.com",
    phone: "123-999-5555",
    growthStage: "developing",
  },
  {
    name: "Lisa Brown",
    joinDate: "Jan 15, 2018",
    contribution: "76%",
    email: "lisa.brown@email.com",
    phone: "555-555-2222",
    growthStage: "established",
  },
  {
    name: "Robert Neil",
    joinDate: "Mar 11, 2020",
    contribution: "53%",
    email: "robert.neil@email.com",
    phone: "434-828-6172",
    growthStage: "developing",
  },
  {
    name: "Fatima Noor",
    joinDate: "Dec 31, 2017",
    contribution: "47%",
    email: "fatima.noor@email.com",
    phone: "888-202-2022",
    growthStage: "foundation",
  },
];

export const filterByOptions: FilterOption[] = [
  { value: "contribution", label: "Contribution %" },
  { value: "join-date", label: "Join Date" },
  { value: "growth", label: "Growth" },
];
