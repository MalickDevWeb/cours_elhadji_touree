import { z } from 'zod';

export const PhoneRegex = /^(\+221|00221)?[73][0678][0-9]{7}$/;

export const PreinscriptionSchema = z.object({
  id: z.string().optional(),
  childFirstName: z.string()
    .min(2, "Le prénom de l'enfant doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne doit pas dépasser 50 caractères")
    .trim(),
  childLastName: z.string()
    .min(2, "Le nom de l'enfant doit contenir au moins 2 caractères")
    .max(50, "Le nom ne doit pas dépasser 50 caractères")
    .trim(),
  levelId: z.string().min(1, "Niveau requis"),
  courseType: z.enum(['INDIVIDUEL', 'GROUPE']).optional(),
  subjectIds: z.array(z.string()).optional(),
  subjectId: z.string().optional(),
  cycleId: z.string().optional(),
  parentName: z.string()
    .min(2, "Le nom du parent doit contenir au moins 2 caractères")
    .max(80, "Le nom du parent est trop long")
    .trim(),
  parentPhone: z.string()
    .regex(PhoneRegex, "Numéro de téléphone sénégalais valide requis (ex: +221 77 000 00 00)"),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),
  date: z.string().optional()
});

export type PreinscriptionInput = z.infer<typeof PreinscriptionSchema>;

export function validatePreinscription(data: unknown): PreinscriptionInput {
  return PreinscriptionSchema.parse(data);
}
