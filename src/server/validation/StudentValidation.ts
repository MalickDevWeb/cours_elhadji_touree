import { z } from 'zod';
import { PhoneRegex } from './PreinscriptionValidation';

export const StudentPhotoSchema = z.object({
  photoUrl: z.string().url("URL de photo invalide (doit être un lien http/https ou base64)")
});

export const StudentSchema = z.object({
  id: z.string().optional(),
  matricule: z.string().min(3, "Matricule trop court").optional(),
  firstName: z.string().min(2, "Prénom requis (min 2 car.)").trim(),
  lastName: z.string().min(2, "Nom requis (min 2 car.)").trim(),
  sex: z.enum(['M', 'F'], { message: "Sexe 'M' ou 'F' requis" }),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Date de naissance invalide"),
  levelId: z.string().min(1, "Identifiant du niveau requis"),
  parentId: z.string().min(1, "Parent rattaché requis"),
  photoUrl: z.string().optional(),
  qrCodeData: z.string().optional()
});

export type StudentInput = z.infer<typeof StudentSchema>;

export function validateStudent(data: unknown): StudentInput {
  return StudentSchema.parse(data);
}
