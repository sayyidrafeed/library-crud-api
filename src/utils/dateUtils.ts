export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isOverdue(dueDate: Date): boolean {
  return new Date() > dueDate;
}

export function formatDate(date: Date): string {
  const isoString = date.toISOString();
  const datePart = isoString.split('T')[0];
  return datePart ?? isoString;
}
