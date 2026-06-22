import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toDateInputValue(dateTime: string) {
  return dateTime.slice(0, 10);
}

function parseApiDateParts(dateTime: string) {
  const [datePart = '', timePart = ''] = dateTime.split(' ');
  const [year = 0, month = 1, day = 1] = datePart.split('-').map(Number);

  return { year, month, day, timePart };
}

export function formatDate(dateTime: string) {
  const { year, month, day } = parseApiDateParts(dateTime);
  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}

export function formatDateTime(dateTime: string) {
  const { timePart } = parseApiDateParts(dateTime);
  const formattedDate = formatDate(dateTime);

  return timePart ? `${formattedDate} · ${timePart}` : formattedDate;
}
