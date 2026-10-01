import crypto from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE = 'findcheck_admin';

function token() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not configured');
  return crypto.createHmac('sha256', secret).update('findcheck-admin').digest('hex');
}

export async function isAdmin() {
  const expected = token();
  const value = (await cookies()).get(COOKIE)?.value ?? '';
  return value.length === expected.length && crypto.timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export function adminCookieValue() { return token(); }
export const adminCookieName = COOKIE;
