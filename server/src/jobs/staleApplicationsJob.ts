import cron from 'node-cron';
import JobApplication, { Status } from '../models/JobApplication';
import { sendTelegramNotification } from '../utils/telegram';

const STALE_STATUSES: Status[] = ['Sent', 'Viewed'];
const STALE_DAYS = 3;

export async function checkStaleApplications(): Promise<void> {
  const threshold = new Date(Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000);

  const staleApplications = await JobApplication.find({
    status: { $in: STALE_STATUSES },
    updatedAt: { $lt: threshold },
  });

  if (staleApplications.length === 0) return;

  const lines = staleApplications.map((app) => `- ${app.title} (${app.platform})`);
  const message = `⏰ Нагадування: ${staleApplications.length} заявок без оновлення понад 3 дні:\n${lines.join('\n')}`;

  await sendTelegramNotification(message);
}

export function scheduleStaleApplicationsJob(): void {
  cron.schedule(
    '0 13 * * *',
    () => {
      checkStaleApplications().catch((error) => {
        console.error('Failed to run stale applications check:', error);
      });
    },
    { timezone: 'Europe/Kyiv' },
  );
}
