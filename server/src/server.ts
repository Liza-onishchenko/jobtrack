import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import jobApplicationRoutes from './routes/jobApplicationRoutes';
import contactRoutes from './routes/contactRoutes';
import { scheduleStaleApplicationsJob } from './jobs/staleApplicationsJob';
import { GENERIC_ERROR_MESSAGE } from './utils/errorResponse';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', jobApplicationRoutes);
app.use('/api/contact', contactRoutes);

// Centralized error handler — must be registered last, after all routes/middleware.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: GENERIC_ERROR_MESSAGE });
});

async function start() {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB');
      scheduleStaleApplicationsJob();
    } else {
      console.warn('MONGO_URI is not set, skipping database connection');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
