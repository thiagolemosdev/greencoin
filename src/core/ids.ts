let counter = 0;

export function generateId(prefix = "id"): string {
  return `${prefix}-${++counter}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateUid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
