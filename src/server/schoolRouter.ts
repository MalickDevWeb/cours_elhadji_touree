import { Router } from 'express';
import { studentService, parentService, paymentService, teacherService, preinscriptionService } from './container';
import { cloudinaryService } from './services/CloudinaryService';
import { redisService } from './services/RedisService';
import { uploadRouter } from './uploadRouter';

export const schoolRouter = Router();

schoolRouter.use('/', uploadRouter);

// Élèves
schoolRouter.get('/students', async (req, res) => {
  try {
    const pId = req.query.parentId as string;
    const key = pId ? `students_p_${pId}` : 'students_all';
    const cached = await redisService.getJson(key);
    if (cached) return res.json(cached);

    const data = pId ? await studentService.getStudentsByParentId(pId) : await studentService.getAllStudents();
    await redisService.setJson(key, data, 120);
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

schoolRouter.get('/students/:id', async (req, res) => {
  try {
    const key = `student_${req.params.id}`;
    const cached = await redisService.getJson(key);
    if (cached) return res.json(cached);

    const item = await studentService.getStudentById(req.params.id);
    if (!item) return res.status(404).json({ error: "Élève non trouvé" });
    await redisService.setJson(key, item, 120);
    res.json(item);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

schoolRouter.post('/students', async (req, res) => {
  try {
    const created = await studentService.createStudent(req.body);
    await redisService.invalidatePattern('student*');
    res.status(201).json(created);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

schoolRouter.post('/students/:id/photo', async (req, res) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl) return res.status(400).json({ error: "photoUrl requise" });
    const uploaded = await cloudinaryService.uploadImage(photoUrl, 'students');
    const updated = await studentService.updateStudentPhoto(req.params.id, uploaded.url);
    if (!updated) return res.status(404).json({ error: "Élève non trouvé" });
    await redisService.invalidatePattern('student*');
    res.json({ success: true, photoUrl: uploaded.url, isCloudinary: uploaded.isCloudinary, student: updated });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// Parents
schoolRouter.get('/parents/lookup', async (req, res) => {
  try {
    const phone = req.query.phone as string;
    if (!phone) return res.status(400).json({ error: "Téléphone requis" });
    const parent = await parentService.getParentByPhone(phone);
    if (!parent) return res.status(404).json({ error: "Parent non trouvé" });
    res.json({ parent, students: await studentService.getStudentsByParentId(parent.id) });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

schoolRouter.get('/parents', async (_req, res) => {
  try {
    const cached = await redisService.getJson('parents_all');
    if (cached) return res.json(cached);
    const data = await parentService.getAllParents();
    await redisService.setJson('parents_all', data, 120);
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// Paiements
schoolRouter.get('/payments', async (req, res) => {
  try {
    const sId = req.query.studentId as string;
    const key = `payments_${sId || 'all'}`;
    const cached = await redisService.getJson(key);
    if (cached) return res.json(cached);
    const data = await paymentService.getPaymentsByStudentId(sId);
    await redisService.setJson(key, data, 120);
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

schoolRouter.post('/payments', async (req, res) => {
  try {
    const recorded = await paymentService.recordPayment(req.body);
    await redisService.invalidatePattern('payments_*');
    res.status(201).json(recorded);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Enseignants & Préinscriptions
schoolRouter.get('/teachers', async (_req, res) => {
  try {
    const cached = await redisService.getJson('teachers_all');
    if (cached) return res.json(cached);
    const data = await teacherService.getAllTeachers();
    await redisService.setJson('teachers_all', data, 300);
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

schoolRouter.get('/preinscriptions', async (_req, res) => {
  try {
    const cached = await redisService.getJson('preinscriptions_all');
    if (cached) return res.json(cached);
    const data = await preinscriptionService.getAll();
    await redisService.setJson('preinscriptions_all', data, 120);
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});
