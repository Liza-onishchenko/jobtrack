import api from './axios';

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export async function sendContactMessage(data: ContactInput): Promise<void> {
  await api.post('/contact', data);
}
