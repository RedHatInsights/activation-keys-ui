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

export const sortActivationKeys = (
  activationKeys,
  sortColumnIndex,
  sortDirection,
  columnsMap
) => {
  return [...activationKeys].sort((a, b) => {
    const aValue = a[columnsMap[sortColumnIndex]];
    const bValue = b[columnsMap[sortColumnIndex]];
    if (sortColumnIndex === 4) {
      const aDate = new Date(a.updatedAt);
      const bDate = new Date(b.updatedAt);
      return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
    }
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
};
