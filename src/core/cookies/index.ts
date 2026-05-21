export type CookieConsent = {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  acceptedAt: string | null;
};

const COOKIE_CONSENT_KEY = "cookie_consent";

export function getCookieConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

export function setCookieConsent(consent: Omit<CookieConsent, "acceptedAt">): void {
  const value: CookieConsent = { ...consent, acceptedAt: new Date().toISOString() };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(value));
}

export function hasConsented(): boolean {
  return getCookieConsent()?.acceptedAt !== null;
}
