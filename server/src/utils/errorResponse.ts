import { Response } from 'express';

export const GENERIC_ERROR_MESSAGE = 'Something went wrong, please try again';

export function sendServerError(res: Response, context: string, error: unknown): void {
  console.error(context, error);
  res.status(500).json({ message: GENERIC_ERROR_MESSAGE });
}
