import api from './axios';
import type { AuthUser } from '../features/auth/authSlice';

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function registerRequest(data: {
  email: string;
  password: string;
  name: string;
}): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', data);
  return res.data;
}

export async function loginRequest(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', data);
  return res.data;
}

export async function updateProfileRequest(data: { name: string }): Promise<{ user: AuthUser }> {
  const res = await api.put<{ user: AuthUser }>('/auth/profile', data);
  return res.data;
}
