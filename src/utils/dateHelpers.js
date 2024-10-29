export const printDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) {
    return 'Invalid Date';
  }
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  return `${date.getUTCFullYear()}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
};

export const sortByUpdatedAtDate = (data, sortDirection = 'asc') => {
  return [...data].sort((a, b) => {
    const aDate = new Date(a.updatedAt);
    const bDate = new Date(b.updatedAt);
    return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
  });
};
