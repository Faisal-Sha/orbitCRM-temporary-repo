
import { LeadData, NoShowData, ReferralData } from "./types";
import { Milestone } from "@/components/MilestonesIcon";
import { nanoid } from "nanoid";

// Leads data and milestones
export const generateLeadsData = (): LeadData[] => {
  return [
    {
      id: nanoid(),
      name: "John Smith",
      inquiryDate: "May 10, 2025",
      interest: "75%",
      email: "j.smith@email.com",
      phone: "111-111-1111",
    },
    {
      id: nanoid(),
      name: "Alice Johnson",
      inquiryDate: "May 08, 2025",
      interest: "90%",
      email: "a.johnson@email.com",
      phone: "222-222-2222",
    },
    {
      id: nanoid(),
      name: "David Wilson",
      inquiryDate: "May 05, 2025",
      interest: "45%",
      email: "d.wilson@email.com",
      phone: "333-333-3333",
    },
    {
      id: nanoid(),
      name: "Emily Davis",
      inquiryDate: "May 03, 2025",
      interest: "85%",
      email: "e.davis@email.com",
      phone: "444-444-4444",
    },
    {
      id: nanoid(),
      name: "Michael Brown",
      inquiryDate: "Apr 29, 2025",
      interest: "60%",
      email: "m.brown@email.com",
      phone: "555-555-5555",
    },
    {
      id: nanoid(),
      name: "Sarah Miller",
      inquiryDate: "Apr 27, 2025",
      interest: "95%",
      email: "s.miller@email.com",
      phone: "666-666-6666",
    },
    {
      id: nanoid(),
      name: "Robert Taylor",
      inquiryDate: "Apr 25, 2025",
      interest: "40%",
      email: "r.taylor@email.com",
      phone: "777-777-7777",
    },
    {
      id: nanoid(),
      name: "Jennifer White",
      inquiryDate: "Apr 22, 2025",
      interest: "80%",
      email: "j.white@email.com",
      phone: "888-888-8888",
    },
  ];
};

export const milestoneSets: Record<string, Milestone[]> = {
  "95%": [
    { completed: true, label: "Application" },
    { completed: false, label: "Verification" },
    { completed: false, label: "Eligible" },
    { completed: false, label: "Scheduled" },
    { completed: false, label: "Client" },
  ],
  "90%": [
    { completed: false, label: "Application" },
    { completed: false, label: "Verification" },
    { completed: false, label: "Eligible" },
    { completed: false, label: "Scheduled" },
    { completed: true, label: "Client" },
  ],
  "85%": [
    { completed: true, label: "Application" },
    { completed: true, label: "Verification" },
    { completed: false, label: "Eligible" },
    { completed: false, label: "Scheduled" },
    { completed: true, label: "Client" },
  ],
  "80%": [
    { completed: true, label: "Application" },
    { completed: false, label: "Verification" },
    { completed: false, label: "Eligible" },
    { completed: true, label: "Scheduled" },
    { completed: false, label: "Client" },
  ],
  "75%": [
    { completed: true, label: "Application" },
    { completed: true, label: "Verification" },
    { completed: true, label: "Eligible" },
    { completed: true, label: "Scheduled" },
    { completed: true, label: "Client" },
  ],
  "70%": [
    { completed: false, label: "Application" },
    { completed: false, label: "Verification" },
    { completed: true, label: "Eligible" },
    { completed: true, label: "Scheduled" },
    { completed: false, label: "Client" },
  ],
};

// No Shows data and milestones
export const generateNoShowsData = (): NoShowData[] => {
  return [
    {
      name: "Linda Gomez",
      inquiryDate: "May 15, 2025",
      interest: "90%",
      email: "l.gomez@email.com",
      phone: "999-999-9999",
      status: "Active",
      person_id: "05791fc3-3277-4978-a5eb-674934e81047",
    },
    {
      name: "Steven Clark",
      inquiryDate: "May 13, 2025",
      interest: "60%",
      email: "s.clark@email.com",
      phone: "101-202-3030",
      status: "Not Set",
      person_id: "05791fc3-3277-4978-a5eb-674934e81048",
    },
    {
      name: "Tina Adams",
      inquiryDate: "May 12, 2025",
      interest: "80%",
      email: "t.adams@email.com",
      phone: "404-505-6060",
      status: "On Hold",
      person_id: "05791fc3-3277-4978-a5eb-674934e81049",
    },
    {
      name: "Gregory Lee",
      inquiryDate: "May 09, 2025",
      interest: "45%",
      email: "g.lee@email.com",
      phone: "707-808-9090",
      status: "Inactive",
      person_id: "05791fc3-3277-4978-a5eb-674934e81050",
    },
  ];
};

export const milestoneSetsNoShows: Record<string, Milestone[]> = {
  "90%": [
    { completed: true, label: "Application" },
    { completed: true, label: "Verification" },
    { completed: true, label: "Eligible" },
    { completed: false, label: "Scheduled" },
    { completed: false, label: "Client" },
  ],
  "80%": [
    { completed: true, label: "Application" },
    { completed: false, label: "Verification" },
    { completed: false, label: "Eligible" },
    { completed: true, label: "Scheduled" },
    { completed: false, label: "Client" },
  ],
  "60%": [
    { completed: false, label: "Application" },
    { completed: true, label: "Verification" },
    { completed: false, label: "Eligible" },
    { completed: false, label: "Scheduled" },
    { completed: false, label: "Client" },
  ],
  "45%": [
    { completed: false, label: "Application" },
    { completed: false, label: "Verification" },
    { completed: false, label: "Eligible" },
    { completed: false, label: "Scheduled" },
    { completed: false, label: "Client" },
  ],
};

// Referrals data and milestones
export const generateReferralsData = (): ReferralData[] => {
  return [
    {
      id: nanoid(),
      person_id: nanoid(),
      entryDate: "May 14, 2025",
      interest: "88%",
      person: {
        first_name: "Nancy",
        last_name: "Pierce",
        email: "n.pierce@email.com",
        phone: "201-555-7171",
      },
    },
    {
      id: nanoid(),
      person_id: nanoid(),
      entryDate: "May 11, 2025",
      interest: "77%",
      person: {
        first_name: "Victor",
        last_name: "Chan",
        email: "v.chan@email.com",
        phone: "202-555-4623",
      },
    },
    {
      id: nanoid(),
      person_id: nanoid(),
      entryDate: "May 08, 2025",
      interest: "69%",
      person: {
        first_name: "Isabel",
        last_name: "Jeffries",
        email: "i.jeffries@email.com",
        phone: "203-555-1247",
      },
    },
    {
      id: nanoid(),
      person_id: nanoid(),
      entryDate: "May 03, 2025",
      interest: "82%",
      person: {
        first_name: "Carlos",
        last_name: "Ruiz",
        email: "c.ruiz@email.com",
        phone: "204-555-3344",
      },
    },
  ];
};

export const milestoneSetsReferrals: Record<string, Milestone[]> = {
  "88%": [
    { completed: true, label: "Application" },
    { completed: false, label: "Verification" },
    { completed: false, label: "Eligible" },
    { completed: false, label: "Scheduled" },
    { completed: false, label: "Client" },
  ],
  "77%": [
    { completed: true, label: "Application" },
    { completed: true, label: "Verification" },
    { completed: false, label: "Eligible" },
    { completed: false, label: "Scheduled" },
    { completed: false, label: "Client" },
  ],
  "69%": [
    { completed: false, label: "Application" },
    { completed: true, label: "Verification" },
    { completed: false, label: "Eligible" },
    { completed: false, label: "Scheduled" },
    { completed: false, label: "Client" },
  ],
  "82%": [
    { completed: true, label: "Application" },
    { completed: true, label: "Verification" },
    { completed: false, label: "Eligible" },
    { completed: true, label: "Scheduled" },
    { completed: false, label: "Client" },
  ],
};

export const filterByOptions = [
  { value: "interest", label: "Interest %" },
  { value: "inquiry-date", label: "Inquiry date" },
  { value: "lead-source", label: "Lead source" },
  { value: "milestone", label: "Milestone" },
];
