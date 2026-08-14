import { z } from 'zod';
import { PhoneRegex } from './PreinscriptionValidation';

export const TeacherSchema = z.object({
  id: z.string().optional(),
  fullName: z.string()
    .min(3, "Le nom de l'enseignant doit contenir au moins 3 caractères")
    .max(100, "Le nom est trop long")
    .trim(),
  phone: z.string().regex(PhoneRegex, "Numéro de téléphone sénégalais invalide"),
  subject: z.string().min(2, "Matière enseignée requise"),
  levels: z.string().min(1, "Au moins un niveau d'enseignement requis")
});

export type TeacherInput = z.infer<typeof TeacherSchema>;

export function validateTeacher(data: unknown): TeacherInput {
  return TeacherSchema.parse(data);
}
