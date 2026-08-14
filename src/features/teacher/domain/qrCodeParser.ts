import { Student } from '../../../types';
import { getFormattedId } from '../../admin/components/StudentCardUtils';

export interface QrParsedInfo {
  raw: string;
  extractedId?: string;
  extractedCardNo?: string;
  candidateStrings: string[];
}

export function parseQrPayload(payload: string): QrParsedInfo {
  const trimmed = (payload || '').trim();
  const candidates = new Set<string>();
  candidates.add(trimmed.toLowerCase());

  // Check JSON format
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.id) candidates.add(String(parsed.id).trim().toLowerCase());
      if (parsed.studentId) candidates.add(String(parsed.studentId).trim().toLowerCase());
      if (parsed.cardNo) candidates.add(String(parsed.cardNo).trim().toLowerCase());
      if (parsed.formattedId) candidates.add(String(parsed.formattedId).trim().toLowerCase());
      if (parsed.card) candidates.add(String(parsed.card).trim().toLowerCase());
    } catch {}
  }

  // Check URL format (e.g. ?id=std-1 or /student/std-1)
  if (trimmed.includes('http://') || trimmed.includes('https://') || trimmed.includes('?')) {
    try {
      const url = new URL(trimmed.startsWith('http') ? trimmed : `https://elite.sn/${trimmed}`);
      const idParam = url.searchParams.get('id') || url.searchParams.get('studentId') || url.searchParams.get('card');
      if (idParam) candidates.add(idParam.trim().toLowerCase());
      const pathSegments = url.pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) candidates.add(pathSegments[pathSegments.length - 1].toLowerCase());
    } catch {}
  }

  // Remove common prefixes like "STUDENT:", "ID:", "CARD:"
  const cleanPrefixed = trimmed.replace(/^(STUDENT:|ID:|CARD:|ELITE:)/i, '').trim();
  if (cleanPrefixed) candidates.add(cleanPrefixed.toLowerCase());

  return {
    raw: trimmed,
    candidateStrings: Array.from(candidates).filter(Boolean),
  };
}

export function matchStudentByQr(payload: string, students: Student[]): Student | undefined {
  const { candidateStrings, raw } = parseQrPayload(payload);
  const rawLower = raw.toLowerCase();

  return students.find(s => {
    const sId = s.id.toLowerCase();
    const sCardNo = (s.cardNo || '').toLowerCase();
    const sFormatted = getFormattedId(s).toLowerCase();
    const sFirstName = s.firstName.toLowerCase();
    const sLastName = s.lastName.toLowerCase();
    const fullName = `${sFirstName} ${sLastName}`;

    // Direct match against candidate strings
    for (const c of candidateStrings) {
      if (c === sId || c === sCardNo || c === sFormatted) return true;
      if (c.includes(sId) || c.includes(sCardNo) || c.includes(sFormatted)) return true;
      if (sFormatted.includes(c) && c.length >= 4) return true;
      if (c === fullName || (c.includes(sFirstName) && c.includes(sLastName))) return true;
    }

    // Direct match against raw
    if (rawLower === sId || rawLower === sCardNo || rawLower === sFormatted) return true;
    if (rawLower.includes(sId) || (sCardNo && rawLower.includes(sCardNo)) || rawLower.includes(sFormatted)) return true;

    return false;
  });
}
