import { useState } from 'react';
import type { FormEvent } from 'react';
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
      setError('Title, company and applied date are required');
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
      setError('Failed to save application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h2>Add application</h2>
        <form onSubmit={handleSubmit} noValidate>
          {error && <p className="form-error">{error}</p>}

          <label htmlFor="platform">Platform</label>
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

          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <label htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />

          <label htmlFor="appliedDate">Applied date</label>
          <input
            id="appliedDate"
            type="date"
            value={appliedDate}
            onChange={(event) => setAppliedDate(event.target.value)}
          />

          <label htmlFor="budget">Budget ($)</label>
          <input
            id="budget"
            type="number"
            min="0"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
          />

          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as Status)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label htmlFor="link">Link</label>
          <input
            id="link"
            type="url"
            value={link}
            placeholder="https://..."
            onChange={(event) => setLink(event.target.value)}
          />

          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
