import { STATUSES } from '../types/jobApplication';
import type { JobApplication, Status } from '../types/jobApplication';
import StatusBadge from './StatusBadge';
import { isStaleApplication } from '../utils/staleness';

interface Props {
  application: JobApplication;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
}

export default function ApplicationCard({ application, onStatusChange, onDelete }: Props) {
  function handleDelete() {
    if (window.confirm(`Delete "${application.title}" at ${application.company}? This cannot be undone.`)) {
      onDelete(application._id);
    }
  }

  const appliedDate = new Date(application.appliedDate).toLocaleDateString();
  const isStale = isStaleApplication(application);

  return (
    <div className="application-card">
      <div className="application-card-header">
        <span className="application-platform">{application.platform}</span>
        <div className="application-card-header-right">
          {isStale && (
            <span className="stale-badge" title="No update in 3+ days">
              ⏰
            </span>
          )}
          <StatusBadge status={application.status} />
        </div>
      </div>

      <h3 className="application-title">{application.title}</h3>
      <p className="application-company">{application.company}</p>

      <div className="application-meta">
        <span>{appliedDate}</span>
        {application.budget !== undefined && <span>${application.budget}</span>}
      </div>

      {application.link && (
        <a
          href={application.link}
          target="_blank"
          rel="noreferrer"
          className="application-link"
        >
          View listing
        </a>
      )}

      {application.notes && <p className="application-notes">{application.notes}</p>}

      <div className="application-card-footer">
        <select
          value={application.status}
          onChange={(event) => onStatusChange(application._id, event.target.value as Status)}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button type="button" className="danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
