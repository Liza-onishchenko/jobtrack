import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { isAxiosError } from 'axios';
import { useAppDispatch } from '../app/hooks';
import { setCredentials } from '../features/auth/authSlice';
import { registerRequest } from '../api/authApi';

function validate(
  t: TFunction,
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): string | null {
  if (!name.trim()) return t('auth.register.errors.nameRequired');
  if (!email.trim()) return t('auth.register.errors.emailRequired');
  if (!/^\S+@\S+\.\S+$/.test(email)) return t('auth.register.errors.emailInvalid');
  if (password.length < 6) return t('auth.register.errors.passwordLength');
  if (password !== confirmPassword) return t('auth.register.errors.passwordMismatch');
  return null;
}

export default function Register() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validationError = validate(t, name, email, password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const data = await registerRequest({ name, email, password });
      dispatch(setCredentials(data));
      navigate('/dashboard');
    } catch (err) {
      const message = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setError(message ?? t('auth.register.errors.failed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1>{t('auth.register.title')}</h1>
        {error && <p className="form-error">{error}</p>}

        <label htmlFor="name">{t('auth.register.nameLabel')}</label>
        <input
          id="name"
          type="text"
          value={name}
          autoComplete="name"
          onChange={(event) => setName(event.target.value)}
        />

        <label htmlFor="email">{t('auth.register.emailLabel')}</label>
        <input
          id="email"
          type="email"
          value={email}
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">{t('auth.register.passwordLabel')}</label>
        <input
          id="password"
          type="password"
          value={password}
          autoComplete="new-password"
          onChange={(event) => setPassword(event.target.value)}
        />

        <label htmlFor="confirmPassword">{t('auth.register.confirmPasswordLabel')}</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          autoComplete="new-password"
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? t('auth.register.submitting') : t('auth.register.submit')}
        </button>

        <p>
          {t('auth.register.haveAccount')} <Link to="/login">{t('auth.register.loginLink')}</Link>
        </p>
      </form>
    </div>
  );
}
