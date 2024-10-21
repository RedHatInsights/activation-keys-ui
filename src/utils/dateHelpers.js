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

export const sortData = (data, columnIndex, direction, columnNames) => {
  return [...data].sort((a, b) => {
    const aValue = a[columnNames[columnIndex]];
    const bValue = b[columnNames[columnIndex]];
    if (columnIndex === 4) {
      const aDate = new Date(a.updatedAt);
      const bDate = new Date(b.updatedAt);
      return direction === 'asc' ? aDate - bDate : bDate - aDate;
    }
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};
