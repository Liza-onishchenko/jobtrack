import type { Status } from '../types/jobApplication';

const STATUS_CLASS: Record<Status, string> = {
  Sent: 'status-sent',
  Viewed: 'status-viewed',
  Interview: 'status-interview',
  Rejected: 'status-rejected',
  Accepted: 'status-accepted',
};

export default function StatusBadge({ status }: { status: Status }) {
  return <span className={`status-badge ${STATUS_CLASS[status]}`}>{status}</span>;
}
