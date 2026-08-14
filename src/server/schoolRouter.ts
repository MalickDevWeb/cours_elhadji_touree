import { Router } from 'express';
import { paymentService, teacherService, preinscriptionService } from './container';
import { redisService } from './services/RedisService';
import { uploadRouter } from './uploadRouter';
import { studentRouter } from './studentRouter';

export const schoolRouter = Router();
schoolRouter.use('/', uploadRouter);
schoolRouter.use('/', studentRouter);

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
