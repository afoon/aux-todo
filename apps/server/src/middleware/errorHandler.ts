import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '../../generated/prisma/client.js';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

/**
 * Wraps async route handlers to catch errors and pass them to Express's error handler.
 */
export const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handler middleware.
 * Handles Prisma errors, validation errors, and generic errors.
 */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  // Prisma record not found (P2025)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Resource not found' });
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'A record with this value already exists' });
    }
    if (err.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid reference' });
    }
  }

  // Validation error (e.g. missing required fields)
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ error: 'Invalid request data', details: err.message });
  }

  // Custom error with status
  if (err && typeof err === 'object' && 'statusCode' in err && typeof (err as { statusCode: number }).statusCode === 'number') {
    const statusErr = err as { statusCode: number; message?: string };
    return res.status(statusErr.statusCode).json({ error: statusErr.message ?? 'Request failed' });
  }

  // Default: 500 Internal Server Error
  res.status(500).json({ error: 'Internal server error' });
};
