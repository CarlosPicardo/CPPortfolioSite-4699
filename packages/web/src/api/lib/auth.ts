import { createHmac, randomBytes, timingSafeEqual } from "crypto";

function signingSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is required");
  }
  return secret;
}

export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim() ?? "";

/** Sign a token = payload.hmac (payload = expiry ms). */
export function makeToken(ttlMs = 1000 * 60 * 60 * 24 * 30) {
  const exp = String(Date.now() + ttlMs);
  const sig = createHmac("sha256", signingSecret()).update(exp).digest("hex");
  return `${exp}.${sig}`;
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  const expected = createHmac("sha256", signingSecret()).update(exp).digest("hex");
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  return Number(exp) > Date.now();
}

export function randomKey(ext: string) {
  return `portfolio/${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
}
