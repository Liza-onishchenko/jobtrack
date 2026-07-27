import { Response } from 'express';
import mongoose from 'mongoose';
import JobApplication, {
  PLATFORMS,
  STATUSES,
  Platform,
  Status,
} from '../models/JobApplication';
import { AuthRequest } from '../middleware/authMiddleware';

function isPlatform(value: unknown): value is Platform {
  return typeof value === 'string' && (PLATFORMS as readonly string[]).includes(value);
}

function isStatus(value: unknown): value is Status {
  return typeof value === 'string' && (STATUSES as readonly string[]).includes(value);
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== 'string' && !(value instanceof Date)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function createApplication(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { platform, title, company, appliedDate, budget, status, link, notes } = req.body;

    if (!platform || !title || !company || !appliedDate) {
      res.status(400).json({ message: 'platform, title, company and appliedDate are required' });
      return;
    }

    if (!isPlatform(platform)) {
      res.status(400).json({ message: `platform must be one of: ${PLATFORMS.join(', ')}` });
      return;
    }

    if (status !== undefined && !isStatus(status)) {
      res.status(400).json({ message: `status must be one of: ${STATUSES.join(', ')}` });
      return;
    }

    const parsedDate = parseDate(appliedDate);
    if (!parsedDate) {
      res.status(400).json({ message: 'appliedDate must be a valid date' });
      return;
    }

    const application = await JobApplication.create({
      userId: req.userId,
      platform,
      title,
      company,
      appliedDate: parsedDate,
      budget,
      status,
      link,
      notes,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create application', error: (error as Error).message });
  }
}

export async function getApplications(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { platform, status } = req.query;
    const filter: Record<string, unknown> = { userId: req.userId };

    if (platform !== undefined) {
      if (!isPlatform(platform)) {
        res.status(400).json({ message: `platform must be one of: ${PLATFORMS.join(', ')}` });
        return;
      }
      filter.platform = platform;
    }

    if (status !== undefined) {
      if (!isStatus(status)) {
        res.status(400).json({ message: `status must be one of: ${STATUSES.join(', ')}` });
        return;
      }
      filter.status = status;
    }

    const applications = await JobApplication.find(filter).sort({ appliedDate: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: (error as Error).message });
  }
}

export async function updateApplication(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { platform, title, company, appliedDate, budget, status, link, notes } = req.body;

    if (platform !== undefined && !isPlatform(platform)) {
      res.status(400).json({ message: `platform must be one of: ${PLATFORMS.join(', ')}` });
      return;
    }

    if (status !== undefined && !isStatus(status)) {
      res.status(400).json({ message: `status must be one of: ${STATUSES.join(', ')}` });
      return;
    }

    const update: Record<string, unknown> = {};

    if (platform !== undefined) update.platform = platform;
    if (title !== undefined) update.title = title;
    if (company !== undefined) update.company = company;
    if (budget !== undefined) update.budget = budget;
    if (status !== undefined) update.status = status;
    if (link !== undefined) update.link = link;
    if (notes !== undefined) update.notes = notes;

    if (appliedDate !== undefined) {
      const parsedDate = parseDate(appliedDate);
      if (!parsedDate) {
        res.status(400).json({ message: 'appliedDate must be a valid date' });
        return;
      }
      update.appliedDate = parsedDate;
    }

    const application = await JobApplication.findOneAndUpdate(
      { _id: id, userId: req.userId },
      update,
      { returnDocument: 'after', runValidators: true },
    );

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.json(application);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: 'Invalid application id' });
      return;
    }
    res.status(500).json({ message: 'Failed to update application', error: (error as Error).message });
  }
}

export async function deleteApplication(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const application = await JobApplication.findOneAndDelete({ _id: id, userId: req.userId });

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.json({ message: 'Application deleted' });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: 'Invalid application id' });
      return;
    }
    res.status(500).json({ message: 'Failed to delete application', error: (error as Error).message });
  }
}

export async function getCalendar(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const now = new Date();

    const year = req.query.year !== undefined ? Number(req.query.year) : now.getUTCFullYear();
    const month = req.query.month !== undefined ? Number(req.query.month) : now.getUTCMonth() + 1;

    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      res.status(400).json({ message: 'month must be an integer 1-12 and year must be a valid integer' });
      return;
    }

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    const results = await JobApplication.aggregate([
      { $match: { userId, appliedDate: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$appliedDate' } },
          count: { $sum: 1 },
        },
      },
    ]);

    const calendar: Record<string, number> = {};
    for (const entry of results as { _id: string; count: number }[]) {
      calendar[entry._id] = entry.count;
    }

    res.json(calendar);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch calendar', error: (error as Error).message });
  }
}

export async function getStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const [result] = await JobApplication.aggregate([
      { $match: { userId } },
      {
        $facet: {
          total: [{ $count: 'count' }],
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          byPlatform: [{ $group: { _id: '$platform', count: { $sum: 1 } } }],
        },
      },
    ]);

    const total: number = result.total[0]?.count ?? 0;

    const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<Status, number>;
    for (const entry of result.byStatus as { _id: Status; count: number }[]) {
      byStatus[entry._id] = entry.count;
    }

    const byPlatform = Object.fromEntries(PLATFORMS.map((p) => [p, 0])) as Record<Platform, number>;
    for (const entry of result.byPlatform as { _id: Platform; count: number }[]) {
      byPlatform[entry._id] = entry.count;
    }

    const advanced = byStatus.Interview + byStatus.Accepted;
    const conversionRate = total > 0 ? Number(((advanced / total) * 100).toFixed(2)) : 0;

    res.json({
      total,
      byStatus,
      byPlatform,
      conversionRate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: (error as Error).message });
  }
}
