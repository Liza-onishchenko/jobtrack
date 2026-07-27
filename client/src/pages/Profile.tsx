import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { isAxiosError } from 'axios';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { updateUser } from '../features/auth/authSlice';
import { updateProfileRequest } from '../api/authApi';

const NAME_MAX_LENGTH = 50;

export default function Profile() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [name, setName] = useState(user?.name ?? '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      setError(t('profile.errors.nameRequired'));
      setSuccess(false);
      return;
    }
    if (trimmed.length > NAME_MAX_LENGTH) {
      setError(t('profile.errors.nameTooLong'));
      setSuccess(false);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const { user: updated } = await updateProfileRequest({ name: trimmed });
      dispatch(updateUser(updated));
      setSuccess(true);
    } catch (err) {
      const message = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setError(message ?? t('profile.errors.failed'));
      setSuccess(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1>{t('profile.title')}</h1>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{t('profile.success')}</p>}

        <label htmlFor="name">{t('profile.nameLabel')}</label>
        <input
          id="name"
          type="text"
          value={name}
          maxLength={NAME_MAX_LENGTH}
          onChange={(event) => {
            setName(event.target.value);
            setSuccess(false);
          }}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? t('profile.saving') : t('profile.save')}
        </button>
      </form>
    </div>
  );
}
