import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { isAxiosError } from 'axios';
import { useAppDispatch } from '../app/hooks';
import { setCredentials } from '../features/auth/authSlice';
import { loginRequest } from '../api/authApi';

function validate(t: TFunction, email: string, password: string): string | null {
  if (!email.trim()) return t('auth.login.errors.emailRequired');
  if (!/^\S+@\S+\.\S+$/.test(email)) return t('auth.login.errors.emailInvalid');
  if (!password) return t('auth.login.errors.passwordRequired');
  return null;
}

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validationError = validate(t, email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const data = await loginRequest({ email, password });
      dispatch(setCredentials(data));
      navigate('/dashboard');
    } catch (err) {
      const message = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setError(message ?? t('auth.login.errors.failed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1>{t('auth.login.title')}</h1>
        {error && <p className="form-error">{error}</p>}

        <label htmlFor="email">{t('auth.login.emailLabel')}</label>
        <input
          id="email"
          type="email"
          value={email}
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">{t('auth.login.passwordLabel')}</label>
        <input
          id="password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? t('auth.login.submitting') : t('auth.login.submit')}
        </button>

        <p>
          {t('auth.login.noAccount')} <Link to="/register">{t('auth.login.signupLink')}</Link>
        </p>
      </form>
    </div>
  );
}
