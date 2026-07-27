import { useTranslation } from 'react-i18next';
import type { Status } from '../types/jobApplication';

const STATUS_CLASS: Record<Status, string> = {
  Sent: 'status-sent',
  Viewed: 'status-viewed',
  Interview: 'status-interview',
  Rejected: 'status-rejected',
  Accepted: 'status-accepted',
};

export default function StatusBadge({ status }: { status: Status }) {
  const { t } = useTranslation();
  return <span className={`status-badge ${STATUS_CLASS[status]}`}>{t(`status.${status}`)}</span>;
}
