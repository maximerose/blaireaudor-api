export const getIdFromData = (data: any): string | null => {
  if (!data) return null;
  if (typeof data === 'string') return data.split('/').pop() || null;
  return data.id?.toString() || null;
};
