import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { studentService } from './container';

export const attendanceRouter = Router();
const dbPath = path.join(process.cwd(), 'db.json');

const readDb = () => {
  try {
    if (fs.existsSync(dbPath)) return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (e) {}
  return {};
};

const writeDb = (data: any) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) { return false; }
};

attendanceRouter.post('/attendance/scan-qr', async (req, res) => {
  try {
    const { qrPayload, subjectName = 'Soutien Scolaire', teacherName = 'Professeur', customDate } = req.body;
    if (!qrPayload) return res.status(400).json({ success: false, status: 'INVALID', error: 'qrPayload requis' });

    const students = await studentService.getAllStudents();
    const cleanPayload = String(qrPayload).trim().toLowerCase();

    const student = students.find((s: any) => {
      const sId = s.id.toLowerCase();
      const sCard = (s.cardNo || '').toLowerCase();
      const cleanId = s.id.replace(/\D/g, '').slice(-4);
      const sFormat = `sen-2026-${cleanId}-${(s.sex || 'm').toLowerCase()}`;
      return sId === cleanPayload || sCard === cleanPayload || sFormat === cleanPayload ||
        cleanPayload.includes(sId) || (sCard && cleanPayload.includes(sCard)) || cleanPayload.includes(sFormat);
    });

    if (!student) {
      return res.status(404).json({ success: false, status: 'INVALID', error: `Carte QR (${qrPayload}) introuvable.` });
    }

    const now = customDate ? new Date(customDate) : new Date();
    const dateStr = !isNaN(now.getTime()) ? now.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const timeStr = !isNaN(now.getTime()) ? now.toTimeString().slice(0, 5) : new Date().toTimeString().slice(0, 5);

    const db = readDb();
    const attendanceMap = db.attendanceHistory || {};
    const studentHistory = attendanceMap[student.id] || [];

    const existing = studentHistory.find((r: any) => r.date === dateStr && r.subjectName === subjectName);
    if (existing && existing.status === 'PRESENT') {
      return res.json({
        success: false,
        status: 'ALREADY_SCANNED',
        studentName: `${student.firstName} ${student.lastName}`,
        time: existing.time,
        date: dateStr,
        reason: `${student.firstName} ${student.lastName} a déjà été scanné(e) aujourd'hui (${dateStr}) à ${existing.time}.`
      });
    }

    const newRecord = { date: dateStr, status: 'PRESENT', subjectName, time: timeStr, justification: '' };
    const updatedHistory = [newRecord, ...studentHistory.filter((r: any) => !(r.date === dateStr && r.subjectName === subjectName))];
    attendanceMap[student.id] = updatedHistory;
    db.attendanceHistory = attendanceMap;
    writeDb(db);

    return res.json({
      success: true,
      status: 'SUCCESS',
      studentName: `${student.firstName} ${student.lastName}`,
      studentId: student.id,
      date: dateStr,
      time: timeStr,
      subjectName,
      teacherName
    });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
});

attendanceRouter.get('/attendance/history', (req, res) => {
  const db = readDb();
  res.json(db.attendanceHistory || {});
});
