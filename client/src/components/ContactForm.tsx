import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { isAxiosError } from 'axios';
import { sendContactMessage } from '../api/contactApi';

function validate(t: TFunction, name: string, email: string, message: string): string | null {
  if (!name.trim()) return t('contact.errors.nameRequired');
  if (!email.trim()) return t('contact.errors.emailRequired');
  if (!/^\S+@\S+\.\S+$/.test(email)) return t('contact.errors.emailInvalid');
  if (!message.trim()) return t('contact.errors.messageRequired');
  return null;
}

export default function ContactForm() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validationError = validate(t, name, email, message);
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
      setError(msg ?? t('contact.errors.failed'));
      setSuccess(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{t('contact.success')}</p>}

      <label htmlFor="contact-name">{t('contact.nameLabel')}</label>
      <input
        id="contact-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <label htmlFor="contact-email">{t('contact.emailLabel')}</label>
      <input
        id="contact-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label htmlFor="contact-message">{t('contact.messageLabel')}</label>
      <textarea
        id="contact-message"
        rows={4}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? t('contact.submitting') : t('contact.submit')}
      </button>
    </form>
  );
}
