export const PLATFORMS = ['Upwork', 'Freelancehunt', 'Djinni', 'Other'] as const;
export type Platform = (typeof PLATFORMS)[number];

export const STATUSES = ['Sent', 'Viewed', 'Interview', 'Rejected', 'Accepted'] as const;
export type Status = (typeof STATUSES)[number];

export interface JobApplication {
  _id: string;
  userId: string;
  platform: Platform;
  title: string;
  company: string;
  appliedDate: string;
  budget?: number;
  status: Status;
  link?: string;
  notes?: string;
  createdAt: string;
}
