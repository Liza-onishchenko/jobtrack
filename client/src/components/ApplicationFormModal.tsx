import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { PLATFORMS, STATUSES } from '../types/jobApplication';
import type { Platform, Status } from '../types/jobApplication';
import type { ApplicationInput } from '../api/applicationsApi';

interface Props {
  onClose: () => void;
  onSubmit: (data: ApplicationInput) => Promise<void>;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function ApplicationFormModal({ onClose, onSubmit }: Props) {
  const { t } = useTranslation();
  const [platform, setPlatform] = useState<Platform>(PLATFORMS[0]);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [appliedDate, setAppliedDate] = useState(todayIso());
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState<Status>('Sent');
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!title.trim() || !company.trim() || !appliedDate) {
      setError(t('applications.form.errors.required'));
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        platform,
        title: title.trim(),
        company: company.trim(),
        appliedDate,
        budget: budget ? Number(budget) : undefined,
        status,
        link: link.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch {
      setError(t('applications.form.errors.failed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h2>{t('applications.form.title')}</h2>
        <form onSubmit={handleSubmit} noValidate>
          {error && <p className="form-error">{error}</p>}

          <label htmlFor="platform">{t('applications.form.platformLabel')}</label>
          <select
            id="platform"
            value={platform}
            onChange={(event) => setPlatform(event.target.value as Platform)}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <label htmlFor="title">{t('applications.form.titleLabel')}</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <label htmlFor="company">{t('applications.form.companyLabel')}</label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />

          <label htmlFor="appliedDate">{t('applications.form.appliedDateLabel')}</label>
          <input
            id="appliedDate"
            type="date"
            value={appliedDate}
            onChange={(event) => setAppliedDate(event.target.value)}
          />

          <label htmlFor="budget">{t('applications.form.budgetLabel')}</label>
          <input
            id="budget"
            type="number"
            min="0"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
          />

          <label htmlFor="status">{t('applications.form.statusLabel')}</label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as Status)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`status.${s}`)}
              </option>
            ))}
          </select>

          <label htmlFor="link">{t('applications.form.linkLabel')}</label>
          <input
            id="link"
            type="url"
            value={link}
            placeholder="https://..."
            onChange={(event) => setLink(event.target.value)}
          />

          <label htmlFor="notes">{t('applications.form.notesLabel')}</label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={submitting}>
              {t('applications.form.cancel')}
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? t('applications.form.saving') : t('applications.form.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
