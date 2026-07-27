import { useEffect, useState } from 'react';
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
        <h1>Applications</h1>
        <button type="button" onClick={() => setModalOpen(true)}>
          + Add application
        </button>
      </div>

      <div className="filters">
        <label>
          Platform
          <select
            value={filters.platform}
            onChange={(event) =>
              dispatch(setPlatformFilter(event.target.value as Platform | ''))
            }
          >
            <option value="">All</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select
            value={filters.status}
            onChange={(event) => dispatch(setStatusFilter(event.target.value as Status | ''))}
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && items.length === 0 && <p>No applications yet.</p>}

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
