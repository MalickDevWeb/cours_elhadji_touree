export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('221') && digits.length > 9) {
    return digits.slice(3);
  }
  return digits;
}

export function arePhonesEqual(p1: string, p2: string): boolean {
  const n1 = normalizePhoneNumber(p1);
  const n2 = normalizePhoneNumber(p2);
  return n1.length > 0 && n1 === n2;
}

export function deduplicateParents<T extends { phone: string }>(parents: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const p of parents) {
    const norm = normalizePhoneNumber(p.phone);
    if (!norm) {
      result.push(p);
      continue;
    }
    if (!seen.has(norm)) {
      seen.add(norm);
      result.push(p);
    }
  }
  return result;
}
