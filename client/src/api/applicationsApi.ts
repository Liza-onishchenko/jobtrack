import api from './axios';
import type { ApplicationStats, JobApplication, Platform, Status } from '../types/jobApplication';

export interface ApplicationFilters {
  platform?: Platform;
  status?: Status;
}

export interface ApplicationInput {
  platform: Platform;
  title: string;
  company: string;
  appliedDate: string;
  budget?: number;
  status?: Status;
  link?: string;
  notes?: string;
}

export async function fetchApplicationsRequest(
  filters: ApplicationFilters,
): Promise<JobApplication[]> {
  const res = await api.get<JobApplication[]>('/applications', { params: filters });
  return res.data;
}

export async function createApplicationRequest(
  data: ApplicationInput,
): Promise<JobApplication> {
  const res = await api.post<JobApplication>('/applications', data);
  return res.data;
}

export async function updateApplicationRequest(
  id: string,
  data: Partial<ApplicationInput>,
): Promise<JobApplication> {
  const res = await api.put<JobApplication>(`/applications/${id}`, data);
  return res.data;
}

export async function deleteApplicationRequest(id: string): Promise<void> {
  await api.delete(`/applications/${id}`);
}

export async function fetchStatsRequest(): Promise<ApplicationStats> {
  const res = await api.get<ApplicationStats>('/applications/stats');
  return res.data;
}

export async function fetchCalendarRequest(
  params: { year: number; month: number },
): Promise<Record<string, number>> {
  const res = await api.get<Record<string, number>>('/applications/calendar', { params });
  return res.data;
}
