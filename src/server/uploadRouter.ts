import { Router } from 'express';
import { cloudinaryService } from './services/CloudinaryService';
import { redisService } from './services/RedisService';
import { brevoEmailService } from './services/BrevoEmailService';
import { prisma } from './db/prismaClient';

export const uploadRouter = Router();

uploadRouter.get('/backend/status', async (_req, res) => {
  let neonStatus = { connected: false, configured: !!process.env.DATABASE_URL, message: '' };
  if (process.env.DATABASE_URL) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      neonStatus = { connected: true, configured: true, message: 'Connecté à Neon PostgreSQL' };
    } catch (e: any) {
      neonStatus = { connected: false, configured: true, message: e.message || 'Erreur connexion Neon' };
    }
  } else {
    neonStatus.message = "DATABASE_URL non configurée";
  }

  res.json({
    neon: neonStatus,
    cloudinary: cloudinaryService.getStatus(),
    redis: redisService.getStatus(),
    brevo: brevoEmailService.getStatus()
  });
});

uploadRouter.get('/cloudinary/status', (_req, res) => res.json(cloudinaryService.getStatus()));
uploadRouter.get('/redis/status', (_req, res) => res.json(redisService.getStatus()));

uploadRouter.post('/upload', async (req, res) => {
  try {
    const { image, folder } = req.body;
    if (!image) return res.status(400).json({ error: 'Image requise' });
    const result = await cloudinaryService.uploadImage(image, folder || 'students');
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
