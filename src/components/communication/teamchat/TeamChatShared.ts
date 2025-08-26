
import { useState, useRef, useEffect } from "react";

// Types
export type TaskStatus = "open" | "in-progress" | "completed" | "archived" | "deleted";
export type TaskPriority = "high" | "medium" | "low";
export type TaskCategory =
  | "assessment"
  | "personal"
  | "EHR"
  | "clinical"
  | "admin"
  | "follow-up";

export interface TaskChat {
  id: number;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignedTeammates: string[];
  unread: number;
  lastUpdated: string;
  isFollowUp?: boolean;
  contactName?: string;
  contactAvatar?: string;
  messages: any[];
}

// Dummy Data & Shared Hooks (just export constants as before, hooks can be per component)
export const spacesData = [
  { id: 1, name: "Cymbal Core Teams", unread: 3, pinned: true, members: 12, description: "Main team for core product development and coordination" },
  { id: 2, name: "Marketing Team", unread: 5, pinned: false, members: 8, description: "Marketing strategies and campaigns" },
  { id: 3, name: "Sales Team", unread: 2, pinned: false, members: 10, description: "Sales discussions and strategies" },
  { id: 4, name: "Product Development", unread: 0, pinned: false, members: 6, description: "Product development discussions" },
  { id: 5, name: "Customer Support", unread: 1, pinned: false, members: 4, description: "Customer support and feedback" },
  { id: 6, name: "HR Team", unread: 0, pinned: false, members: 5, description: "Human resources discussions" },
  { id: 7, name: "Finance Team", unread: 0, pinned: false, members: 3, description: "Financial discussions and planning" },
  { id: 8, name: "IT Support", unread: 0, pinned: false, members: 2, description: "IT support and troubleshooting" },
  { id: 9, name: "Legal Team", unread: 0, pinned: false, members: 2, description: "Legal discussions and compliance" },
  { id: 10, name: "Customer Success", unread: 0, pinned: false, members: 14, description: "Customer success strategies and case discussions" },
];

export const directMessagesData = [
  { id: 1, name: "Aisha Patel", status: "active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha", unread: 2, lastActive: "Active now" },
  { id: 2, name: "John Doe", status: "active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John", unread: 1, lastActive: "5 min ago" },
  { id: 3, name: "Jane Smith", status: "active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane", unread: 0, lastActive: "10 min ago" },
  { id: 4, name: "Michael Brown", status: "active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael", unread: 3, lastActive: "15 min ago" },
  { id: 5, name: "Emily Davis", status: "active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", unread: 0, lastActive: "20 min ago" },
  { id: 6, name: "Chris Johnson", status: "active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris", unread: 0, lastActive: "30 min ago" },
  { id: 7, name: "Sarah Wilson", status: "active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", unread: 0, lastActive: "1 hour ago" },
  { id: 8, name: "David Lee", status: "active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", unread: 0, lastActive: "2 hours ago" },
  { id: 9, name: "Laura Taylor", status: "active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura", unread: 0, lastActive: "3 hours ago" },
  { id: 10, name: "Sarah Johnson", status: "active", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", unread: 0, lastActive: "Active now" },
];

export const taskChatsData: TaskChat[] = [
  { id: 1, title: "Complete initial assessment for Sarah Johnson", description: "Comprehensive psychological evaluation and treatment plan recommendations", category: "assessment", priority: "high", status: "in-progress", dueDate: "2024-05-15", assignedTeammates: ["Dr. Wilson", "Emma Davis"], unread: 3, lastUpdated: "10 min ago", messages: [] },
  { id: 2, title: "Follow up with Aisha Patel", description: "Check on the progress of the treatment plan", category: "follow-up", priority: "medium", status: "open", dueDate: "2024-05-20", assignedTeammates: ["Dr. Wilson"], unread: 1, lastUpdated: "2 hours ago", messages: [] },
  { id: 3, title: "Prepare for team meeting", description: "Gather all necessary documents and reports", category: "admin", priority: "high", status: "in-progress", dueDate: "2024-05-25", assignedTeammates: ["Emma Davis"], unread: 0, lastUpdated: "1 day ago", messages: [] },
  { id: 4, title: "Update patient records", description: "Ensure all patient records are up to date", category: "EHR", priority: "medium", status: "completed", dueDate: "2024-05-30", assignedTeammates: ["Dr. Wilson"], unread: 0, lastUpdated: "3 days ago", messages: [] },
  { id: 5, title: "Conduct team training", description: "Organize training sessions for new staff", category: "clinical", priority: "low", status: "open", dueDate: "2024-06-01", assignedTeammates: ["Emma Davis", "John Doe"], unread: 0, lastUpdated: "1 week ago", messages: [] },
  { id: 6, title: "Review financial reports", description: "Analyze the financial performance of the department", category: "admin", priority: "high", status: "in-progress", dueDate: "2024-06-05", assignedTeammates: ["Dr. Wilson"], unread: 0, lastUpdated: "2 weeks ago", messages: [] },
  { id: 7, title: "Plan team-building event", description: "Organize a team-building activity for the staff", category: "personal", priority: "medium", status: "open", dueDate: "2024-06-10", assignedTeammates: ["Emma Davis"], unread: 0, lastUpdated: "3 weeks ago", messages: [] },
  { id: 8, title: "Conduct performance reviews", description: "Evaluate team members' performance", category: "admin", priority: "high", status: "completed", dueDate: "2024-06-15", assignedTeammates: ["Dr. Wilson"], unread: 0, lastUpdated: "1 month ago", messages: [] },
  { id: 9, title: "Prepare for client presentation", description: "Create slides and materials for the upcoming presentation", category: "clinical", priority: "medium", status: "in-progress", dueDate: "2024-06-20", assignedTeammates: ["Emma Davis"], unread: 0, lastUpdated: "2 months ago", messages: [] },
  { id: 10, title: "Complete evaluations", category: "assessment", priority: "high", status: "open", dueDate: "2024-05-19", assignedTeammates: ["Dr. Wilson", "Dr. Smith"], unread: 1, lastUpdated: "2 hours ago", messages: [] },
];

// Helper: status color
export const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "away":
      return "bg-yellow-500";
    case "dnd":
      return "bg-red-500";
    case "offline":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
};

export const getCategoryColor = (category: TaskCategory) => {
  switch (category) {
    case "assessment":
      return "bg-blue-100 text-blue-800";
    case "personal":
      return "bg-green-100 text-green-800";
    case "EHR":
      return "bg-purple-100 text-purple-800";
    case "clinical":
      return "bg-indigo-100 text-indigo-800";
    case "admin":
      return "bg-gray-100 text-gray-800";
    case "follow-up":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Dummy message creators
export const generateDummyMessages = (id: number) => [
  {
    id: 1,
    user: "User 1",
    message: "Hello, how are you?",
    time: "10:00 AM",
    isCurrentUser: false,
    reactions: 0,
    taggedMembers: [],
  },
  {
    id: 2,
    user: "User 2",
    message: "I'm good, thanks! How about you?",
    time: "10:01 AM",
    isCurrentUser: true,
    reactions: 0,
    taggedMembers: [],
  },
];

export const generateTaskMessages = (id: number, task: TaskChat) => [
  {
    id: 1,
    user: "System",
    message: `Task "${task.title}" created.`,
    time: "Just now",
    isCurrentUser: false,
    isSystemMessage: true,
    reactions: 0,
    taggedMembers: [],
  },
];
