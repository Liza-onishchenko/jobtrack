import type { JobApplication } from '../types/jobApplication';

const STALE_DAYS = 3;
const STALE_STATUSES = new Set(['Sent', 'Viewed']);

export function isStaleApplication(application: JobApplication): boolean {
  if (!STALE_STATUSES.has(application.status)) return false;
  const updatedAt = new Date(application.updatedAt).getTime();
  return Date.now() - updatedAt > STALE_DAYS * 24 * 60 * 60 * 1000;
}
