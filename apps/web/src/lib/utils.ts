import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const APP_TIME_ZONE = 'America/Sao_Paulo';

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

function parseApiDateTimeAsUtc(dateTime: string) {
  const { year, month, day, timePart } = parseApiDateParts(dateTime);
  const [hour = 0, minute = 0, second = 0] = timePart.split(':').map(Number);

  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
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

  if (!timePart) {
    return formatDate(dateTime);
  }

  const date = parseApiDateTimeAsUtc(dateTime);
  const parts = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: APP_TIME_ZONE
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  const formattedDate = `${getPart('day')} de ${getPart('month')} de ${getPart('year')}`;
  const formattedTime = `${getPart('hour')}:${getPart('minute')}:${getPart('second')}`;

  return `${formattedDate} · ${formattedTime}`;
}
