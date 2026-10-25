/** Auth input helpers — never concatenate these into SQL; use Supabase Auth APIs only. */

const EMAIL_RE =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const e = normalizeEmail(email);
  if (!e || e.length > 254) return false;
  if (e.includes(" ") || e.includes("\0") || e.includes("\n") || e.includes("\r")) {
    return false;
  }
  return EMAIL_RE.test(e);
}

export function passwordIssues(password: string): string[] {
  const issues: string[] = [];
  if (password.length < 8) issues.push("Mínimo 8 caracteres");
  if (password.length > 72) issues.push("Máximo 72 caracteres");
  if (!/[A-Z]/.test(password)) issues.push("Al menos una mayúscula");
  if (!/[a-z]/.test(password)) issues.push("Al menos una minúscula");
  if (!/[0-9]/.test(password)) issues.push("Al menos un número");
  if (/[\0\r\n]/.test(password)) issues.push("Caracteres no permitidos");
  return issues;
}

export function passwordStrength(password: string): number {
  let s = 0;
  if (password.length >= 8) s++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
  if (/[0-9]/.test(password)) s++;
  if (/[^A-Za-z0-9]/.test(password)) s++;
  return s;
}

/** Client-side cooldown to reduce reset spam (Supabase Auth also rate-limits). */
export function canRequestReset(storageKey = "fc_pwd_reset_at"): {
  ok: boolean;
  waitSec: number;
} {
  if (typeof window === "undefined") return { ok: true, waitSec: 0 };
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return { ok: true, waitSec: 0 };
    const last = Number(raw);
    if (!Number.isFinite(last)) return { ok: true, waitSec: 0 };
    const elapsed = Date.now() - last;
    const cooldownMs = 60_000;
    if (elapsed < cooldownMs) {
      return { ok: false, waitSec: Math.ceil((cooldownMs - elapsed) / 1000) };
    }
    return { ok: true, waitSec: 0 };
  } catch {
    return { ok: true, waitSec: 0 };
  }
}

export function markResetRequested(storageKey = "fc_pwd_reset_at") {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, String(Date.now()));
  } catch {
    /* ignore quota / private mode */
  }
}
