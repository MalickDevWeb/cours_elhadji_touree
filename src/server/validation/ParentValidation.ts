import { z } from 'zod';
import { PhoneRegex } from './PreinscriptionValidation';

export const ParentSchema = z.object({
  id: z.string().optional(),
  fullName: z.string()
    .min(3, "Le nom complet du parent doit contenir au moins 3 caractères")
    .max(100, "Le nom est trop long")
    .trim(),
  phone: z.string().regex(PhoneRegex, "Numéro de téléphone sénégalais invalide"),
  email: z.string().email("Adresse email invalide").optional().or(z.literal('')),
  address: z.string().max(200, "Adresse trop longue").optional()
});

export type ParentInput = z.infer<typeof ParentSchema>;

export function validateParent(data: unknown): ParentInput {
  return ParentSchema.parse(data);
}
