import { useState } from 'react';
import type { FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { sendContactMessage } from '../api/contactApi';

function validate(name: string, email: string, message: string): string | null {
  if (!name.trim()) return 'Name is required';
  if (!email.trim()) return 'Email is required';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email';
  if (!message.trim()) return 'Message is required';
  return null;
}

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validationError = validate(name, email, message);
    if (validationError) {
      setError(validationError);
      setSuccess(false);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await sendContactMessage({ name: name.trim(), email: email.trim(), message: message.trim() });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      const msg = isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined;
      setError(msg ?? 'Failed to send message. Please try again.');
      setSuccess(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">Thanks! Your message has been sent.</p>}

      <label htmlFor="contact-name">Name</label>
      <input
        id="contact-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <label htmlFor="contact-email">Email</label>
      <input
        id="contact-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label htmlFor="contact-message">Message</label>
      <textarea
        id="contact-message"
        rows={4}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );
}
