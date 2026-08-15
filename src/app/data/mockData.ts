import type { UserRec, TicketRec } from '../types';

export const USERS: UserRec[] = [];
export const TICKETS: TicketRec[] = [];

export const C_TREND = [
  { m: "Feb", open: 0, res: 0 },
  { m: "Mar", open: 0, res: 0 },
  { m: "Apr", open: 0, res: 0 },
  { m: "May", open: 0, res: 0 },
  { m: "Jun", open: 0, res: 0 },
  { m: "Jul", open: 0, res: 0 },
];

export const C_PIE = [
  { name: "Open", val: 0, color: "#3b82f6" },
  { name: "In Progress", val: 0, color: "#fbbf24" },
  { name: "Resolved", val: 0, color: "#10b981" },
  { name: "Closed", val: 0, color: "#334155" },
];

export const C_CAT = [
  { cat: "Technical", n: 0 },
  { cat: "Billing", n: 0 },
  { cat: "General", n: 0 },
  { cat: "Feature", n: 0 },
  { cat: "Other", n: 0 },
];

export const C_USR = [
  { m: "Feb", n: 0 },
  { m: "Mar", n: 0 },
  { m: "Apr", n: 0 },
  { m: "May", n: 0 },
  { m: "Jun", n: 0 },
  { m: "Jul", n: 0 },
];

export const mockFetch = <T,>(v: T, ms = 500): Promise<T> => 
  new Promise(r => setTimeout(() => r(v), ms));