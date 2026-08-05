import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';

export interface TokenPayload {
  sub: string;
}

function getAccessSecret(): string {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error('ACCESS_TOKEN_SECRET is not set');
  return secret;
}

function getRefreshSecret(): string {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error('REFRESH_TOKEN_SECRET is not set');
  return secret;
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId } satisfies TokenPayload, getAccessSecret(), {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m') as jwt.SignOptions['expiresIn'],
  });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId } satisfies TokenPayload, getRefreshSecret(), {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN ?? '30d') as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, getAccessSecret()) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, getRefreshSecret()) as TokenPayload;
}

export function getRefreshCookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/api/user',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };
}

export const REFRESH_COOKIE_NAME = 'refreshToken';
