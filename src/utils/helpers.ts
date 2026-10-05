export const pluralize = (count: number, str: string, fallback?: string): string =>
  count > 1 ? fallback || str + 's' : str;

export const downloadFile = (
  data: BlobPart,
  filename: string = `${new Date().toISOString()}`
): void => {
  const type = 'data:text/plain;charset=utf-8,';
  const blob = new Blob([data], { type });
  const link = document.createElement('a');
  link.setAttribute('href', URL.createObjectURL(blob));
  link.setAttribute('download', `${filename}.yml`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
