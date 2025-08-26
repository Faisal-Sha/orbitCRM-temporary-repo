
import { format, isAfter, isBefore, addDays } from "date-fns";

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Blocked" | "Completed" | "Cancelled";
  dueDate: Date;
  sectionId: string;
  createdDate: Date;
}

export interface Note {
  id: string;
  title: string;
  tags: string[];
  starred: boolean;
  folder: string;
  lastModified: Date;
  createdDate: Date;
}

// Generate comprehensive dummy data
export const generateDummyTasks = (): Task[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const overdue = new Date(today);
  overdue.setDate(overdue.getDate() - 3);

  return [
    {
      id: "1",
      title: "Complete quarterly business review presentation",
      category: "Work",
      priority: "High",
      status: "In Progress",
      dueDate: tomorrow,
      sectionId: "personal",
      createdDate: yesterday
    },
    {
      id: "2",
      title: "Schedule team building activities",
      category: "Meeting",
      priority: "Medium",
      status: "To Do",
      dueDate: nextWeek,
      sectionId: "team",
      createdDate: today
    },
    {
      id: "3",
      title: "Update personal fitness goals",
      category: "Health",
      priority: "Low",
      status: "Completed",
      dueDate: yesterday,
      sectionId: "personal",
      createdDate: overdue
    },
    {
      id: "4",
      title: "Review monthly sales targets",
      category: "Work",
      priority: "High",
      status: "Blocked",
      dueDate: overdue,
      sectionId: "goals",
      createdDate: overdue
    },
    {
      id: "5",
      title: "Prepare client presentation materials",
      category: "Meeting",
      priority: "High",
      status: "To Do",
      dueDate: addDays(today, 2),
      sectionId: "team",
      createdDate: today
    },
    {
      id: "6",
      title: "Research industry best practices",
      category: "Research",
      priority: "Medium",
      status: "In Progress",
      dueDate: addDays(today, 5),
      sectionId: "personal",
      createdDate: yesterday
    },
    {
      id: "7",
      title: "Launch new product feature",
      category: "Opportunity",
      priority: "High",
      status: "In Progress",
      dueDate: addDays(today, 10),
      sectionId: "goals",
      createdDate: addDays(today, -5)
    },
    {
      id: "8",
      title: "Team performance evaluation",
      category: "Management",
      priority: "Medium",
      status: "To Do",
      dueDate: addDays(today, 14),
      sectionId: "team",
      createdDate: today
    }
  ];
};

export const generateDummyNotes = (): Note[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  return [
    {
      id: "1",
      title: "Project Architecture Meeting Notes",
      tags: ["Work", "Tech", "Important"],
      starred: true,
      folder: "Work",
      lastModified: today,
      createdDate: yesterday
    },
    {
      id: "2",
      title: "Personal Development Goals for Q4",
      tags: ["Personal", "Goals", "Reflection"],
      starred: false,
      folder: "Personal",
      lastModified: yesterday,
      createdDate: lastWeek
    },
    {
      id: "3",
      title: "Innovation Workshop Ideas",
      tags: ["Ideas", "Innovation", "Brainstorm"],
      starred: true,
      folder: "Ideas",
      lastModified: today,
      createdDate: today
    },
    {
      id: "4",
      title: "Client Feedback Summary",
      tags: ["Work", "Feedback", "Urgent"],
      starred: false,
      folder: "Work",
      lastModified: addDays(today, -2),
      createdDate: addDays(today, -3)
    },
    {
      id: "5",
      title: "Health and Wellness Tracking",
      tags: ["Health", "Personal", "Tracking"],
      starred: true,
      folder: "Personal",
      lastModified: addDays(today, -1),
      createdDate: addDays(today, -10)
    },
    {
      id: "6",
      title: "Market Research Findings",
      tags: ["Research", "Market", "Data"],
      starred: false,
      folder: "Work",
      lastModified: addDays(today, -3),
      createdDate: addDays(today, -5)
    }
  ];
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-red-100 text-red-800";
    case "Medium": return "bg-yellow-100 text-yellow-800";
    case "Low": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "To Do": return "bg-gray-100 text-gray-800";
    case "In Progress": return "bg-blue-100 text-blue-800";
    case "Blocked": return "bg-red-100 text-red-800";
    case "Completed": return "bg-green-100 text-green-800";
    case "Cancelled": return "bg-orange-100 text-orange-800";
    default: return "bg-gray-100 text-gray-800";
  }
};
