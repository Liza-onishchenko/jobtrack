import { Schema, model, Document, Types } from 'mongoose';

export const PLATFORMS = ['Upwork', 'Freelancehunt', 'Djinni', 'Other'] as const;
export type Platform = (typeof PLATFORMS)[number];

export const STATUSES = ['Sent', 'Viewed', 'Interview', 'Rejected', 'Accepted'] as const;
export type Status = (typeof STATUSES)[number];

export interface IJobApplication extends Document {
  userId: Types.ObjectId;
  platform: Platform;
  title: string;
  company: string;
  appliedDate: Date;
  budget?: number;
  status: Status;
  link?: string;
  notes?: string;
  createdAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  platform: {
    type: String,
    enum: PLATFORMS,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  appliedDate: {
    type: Date,
    required: true,
  },
  budget: {
    type: Number,
  },
  status: {
    type: String,
    enum: STATUSES,
    default: 'Sent',
  },
  link: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<IJobApplication>('JobApplication', jobApplicationSchema);
