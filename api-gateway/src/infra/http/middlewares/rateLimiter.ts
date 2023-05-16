import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis, { Redis as RedisClient } from 'ioredis';
import { AppError } from '../../../errors/AppError';

const redisClient: RedisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimiterApiGateway',
  points: 5,
  duration: 10,
});

export async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);
    return next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}
