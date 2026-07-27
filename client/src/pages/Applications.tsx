import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchApplications,
  addApplication,
  editApplication,
  removeApplication,
  setPlatformFilter,
  setStatusFilter,
} from '../features/applications/applicationsSlice';
import { PLATFORMS, STATUSES } from '../types/jobApplication';
import type { Platform, Status } from '../types/jobApplication';
import type { ApplicationInput } from '../api/applicationsApi';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationFormModal from '../components/ApplicationFormModal';

export default function Applications() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items, loading, error, filters } = useAppSelector((state) => state.applications);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch, filters.platform, filters.status]);

  async function handleAdd(data: ApplicationInput) {
    await dispatch(addApplication(data)).unwrap();
  }

  function handleStatusChange(id: string, status: Status) {
    dispatch(editApplication({ id, data: { status } }));
  }

  function handleDelete(id: string) {
    dispatch(removeApplication(id));
  }

  return (
    <div className="page">
      <div className="applications-header">
        <h1>{t('applications.title')}</h1>
        <button type="button" onClick={() => setModalOpen(true)}>
          {t('applications.addButton')}
        </button>
      </div>

      <div className="filters">
        <label>
          {t('applications.platformLabel')}
          <select
            value={filters.platform}
            onChange={(event) =>
              dispatch(setPlatformFilter(event.target.value as Platform | ''))
            }
          >
            <option value="">{t('applications.all')}</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t('applications.statusLabel')}
          <select
            value={filters.status}
            onChange={(event) => dispatch(setStatusFilter(event.target.value as Status | ''))}
          >
            <option value="">{t('applications.all')}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`status.${s}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}
      {loading && <p>{t('applications.loading')}</p>}
      {!loading && items.length === 0 && <p>{t('applications.empty')}</p>}

      <div className="applications-grid">
        {items.map((application) => (
          <ApplicationCard
            key={application._id}
            application={application}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {isModalOpen && (
        <ApplicationFormModal onClose={() => setModalOpen(false)} onSubmit={handleAdd} />
      )}
    </div>
  );
}
