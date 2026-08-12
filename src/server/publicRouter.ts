import { Router } from 'express';
import { readDb } from './dbHelper';
import { preinscriptionService } from './container';
import { prisma } from './db/prismaClient';

export const publicRouter = Router();

publicRouter.get('/health/db', async (req, res) => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.status(500).json({
      connected: false,
      message: "DATABASE_URL n'est pas configurée dans les variables d'environnement.",
      configured: false
    });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({
      connected: true,
      message: "Connexion réussie à la base de données Neon PostgreSQL via Prisma !",
      configured: true
    });
  } catch (error: any) {
    return res.status(500).json({
      connected: false,
      message: error.message || "Impossible de se connecter à la base Neon",
      configured: true
    });
  }
});

publicRouter.get('/info', (req, res) => {
  const db = readDb();
  res.json({
    schoolName: "Groupe Scolaire Élite Dakar",
    tagline: "L'Excellence Éducative du Maternelle au Secondaire",
    phone: "+221 33 820 00 00",
    email: "contact@ecole-elite.sn",
    address: "Almadies, Dakar, Sénégal",
    levelsCount: (db.levels || []).length,
    studentsCount: (db.students || []).length,
    features: [
      "Suivi pédagogique personnalisé",
      "Carte d'étudiant numérique QR code",
      "Espace parents temps réel",
      "Paiements & Reçus sécurisés"
    ]
  });
});

publicRouter.get('/card/verify/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const student = (db.students || []).find((s: any) => s.id === id || s.matricule === id);
  if (!student) {
    return res.status(404).json({ valid: false, message: "Carte ou élève introuvable" });
  }
  const level = (db.levels || []).find((l: any) => l.id === student.levelId);
  res.json({
    valid: true,
    student: {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      sex: student.sex,
      photoUrl: student.photoUrl,
      levelName: level ? level.name : 'N/A',
      status: 'Inscrit / Valide'
    }
  });
});

publicRouter.post('/preinscription', async (req, res) => {
  try {
    const newPre = await preinscriptionService.submitPreinscription(req.body);
    res.json({ success: true, preinscription: newPre });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Erreur préinscription" });
  }
});
