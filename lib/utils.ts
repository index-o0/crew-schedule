import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { nanoid } from 'nanoid';

export function generateId(): string {
  return nanoid(10);
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
}

export function formatDateKorean(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'M월 d일 (EEEE)', { locale: ko });
}

export function encodeScheduleData(data: any): string {
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

export function decodeScheduleData(encoded: string): any {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
