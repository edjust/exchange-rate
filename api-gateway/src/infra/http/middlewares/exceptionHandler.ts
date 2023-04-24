import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../errors/AppError';

export async function exceptionHandler(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response> {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  console.log(err);
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
