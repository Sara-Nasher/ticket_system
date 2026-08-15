export type Lang = "en" | "fa";
export type Page =
  | "landing" | "login" | "register" | "admin-login"
  | "dashboard" | "profile" | "my-tickets" | "ticket-detail" | "create-ticket"
  | "admin-dash" | "admin-users" | "admin-tickets" | "admin-ticket-detail"
  | "reports" | "analytics" | "settings" | "not-found" | "server-error";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type Priority = "low" | "medium" | "high" | "urgent";
export type UserStatus = "active" | "inactive" | "banned";
export type UserRole = "admin" | "user";
export type CalMode = "gregorian" | "jalali";
export type ThemeMode = "dark" | "light" | "system";

export interface AuthUser {
  id: string | number;
  name: string;
  nameFa: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  dept: string;
  status?: UserStatus;
  tickets?: number;
  created?: string;
  lastLogin?: string;
  avatar?: string;
  bio?: string;
}

export interface UserRec {
  id: number;
  name: string;
  nameFa: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  dept: string;
  created: string;
  lastLogin: string;
  tickets: number;
  avatar?: string;
  bio?: string; 
}

export interface TicketRec {
  id: number;
  subject: string;
  subjectFa: string;
  category: string;
  status: TicketStatus;
  priority: Priority;
  userId: number;
  userName: string;
  userNameFa: string;
  created: string;
  updated: string;
  desc: string;
  descFa: string;
  assignee?: string;
  replies: number;
  responses?: TicketResponse[];
}

export interface TicketResponse {
  id: number;
  userId: number;
  userName: string;
  message: string;
  createdAt: string;
}

export interface I18n {
  [key: string]: any;
}

export interface UseApiOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialFilters?: Record<string, any>;
}