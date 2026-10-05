export interface PersonalRecord {
  fpm: number;
  accuracy: number;
  date: number;
}

const KEY = "shqiptype:records";

export function recordKey(dict: string, duration: number, simplified: boolean) {
  return `${dict}-${duration}-${simplified ? "s" : "f"}`;
}

function readAll(): Record<string, PersonalRecord> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function getRecord(key: string): PersonalRecord | null {
  return readAll()[key] ?? null;
}

/** Saves if better; returns true when a new record was set. */
export function saveIfRecord(key: string, rec: PersonalRecord): boolean {
  const all = readAll();
  const prev = all[key];
  if (prev && prev.fpm >= rec.fpm) return false;
  all[key] = rec;
  localStorage.setItem(KEY, JSON.stringify(all));
  return true;
}
