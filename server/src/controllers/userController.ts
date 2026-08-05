import { Request, Response } from 'express';
import { User } from '../models/User';
import {
  REFRESH_COOKIE_NAME,
  getRefreshCookieOptions,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../services/tokenService';
import { HttpError } from '../utils/HttpError';

function toPublicUser(user: { _id: unknown; name: string; email: string }) {
  return { id: String(user._id), name: user.name, email: user.email };
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, phone, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new HttpError(409, 'Email is already in use');
  }

  const user = await User.create({ name, email, phone, password });

  const accessToken = signAccessToken(String(user._id));
  const refreshToken = signRefreshToken(String(user._id));

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
  res.status(201).json({ user: toPublicUser(user), accessToken });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const accessToken = signAccessToken(String(user._id));
  const refreshToken = signRefreshToken(String(user._id));

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
  res.status(200).json({ user: toPublicUser(user), accessToken });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    throw new HttpError(401, 'Refresh token missing');
  }

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new HttpError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new HttpError(401, 'User not found');
  }

  const accessToken = signAccessToken(String(user._id));
  const newRefreshToken = signRefreshToken(String(user._id));

  res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, getRefreshCookieOptions());
  res.status(200).json({ accessToken, user: toPublicUser(user) });
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie(REFRESH_COOKIE_NAME, { ...getRefreshCookieOptions(), maxAge: undefined });
  res.status(200).json({ message: 'Logged out successfully' });
}

export async function getUserInfo(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new HttpError(401, 'Not authenticated');
  }
  res.status(200).json({
    id: String(req.user._id),
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
  });
}
