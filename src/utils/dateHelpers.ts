import type { SortDirection } from '../hooks/types';

export const printDate = (dateString: string | number | Date): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  return `${date.getUTCFullYear()}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
};

export const sortByUpdatedAtDate = <T extends { updatedAt?: string }>(
  data: readonly T[],
  sortDirection: SortDirection = 'asc'
): T[] => {
  return [...data].sort((a, b) => {
    const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : NaN;
    const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : NaN;
    return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
  });
};
