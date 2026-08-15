import moment from 'moment-jalaali';
import type { CalMode } from '../types';

export const PD = "۰۱۲۳۴۵۶۷۸۹";

export const toPd = (n: string | number): string => {
  return String(n).replace(/[0-9]/g, d => PD[+d]);
};

export const JM = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
export const JME = ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"];
export const GM = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function toJalaliDate(gy: number, gm: number, gd: number): [number, number, number] {
  const date = new Date(gy, gm - 1, gd);
  const jDate = moment(date);
  return [jDate.jYear(), jDate.jMonth() + 1, jDate.jDate()];
}

export function fDate(s: string, cal: CalMode | boolean, isRTL: boolean): string {
  if (!s || typeof s !== 'string') {
    return '-';
  }
  
  let year: number, month: number, day: number;
  
  const parts = s.split("-");
  if (parts.length === 3) {
    year = parseInt(parts[0]);
    month = parseInt(parts[1]);
    day = parseInt(parts[2]);
  } else {
    try {
      const date = new Date(s);
      if (isNaN(date.getTime())) return '-';
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate();
    } catch {
      return '-';
    }
  }
  
  if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
    return '-';
  }
  
  const useJalali = cal === "jalali" || cal === true;
  
  if (!useJalali) {
    return `${String(day).padStart(2, "0")} ${GM[month - 1] || month} ${year}`;
  }
  
  try {
    const gregorianDate = new Date(year, month - 1, day);
    const jDate = moment(gregorianDate);
    const jy = jDate.jYear();
    const jm = jDate.jMonth() + 1;
    const jd = jDate.jDate();
    
    if (isRTL) {
      return toPd(`${jd} ${JM[jm - 1] || jm} ${jy}`);
    }
    return `${jd} ${JME[jm - 1] || jm} ${jy}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return `${String(day).padStart(2, "0")} ${GM[month - 1] || month} ${year}`;
  }
}

export function fNum(n: number | string, fa: boolean): string {
  const s = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fa ? toPd(s) : s;
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function getTodayJalali(): string {
  const today = new Date();
  const jDate = moment(today);
  const jy = jDate.jYear();
  const jm = jDate.jMonth() + 1;
  const jd = jDate.jDate();
  return `${jy}-${String(jm).padStart(2, '0')}-${String(jd).padStart(2, '0')}`;
}

export function getTodayGregorian(): string {
  return new Date().toISOString().split('T')[0];
}

export function daysDiff(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}