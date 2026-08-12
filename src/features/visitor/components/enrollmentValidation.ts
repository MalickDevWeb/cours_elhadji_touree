import { z } from 'zod';

export const parentSchema = z.object({
  name: z.string()
    .min(1, "Le nom du parent est obligatoire.")
    .min(3, "Le nom doit contenir au moins 3 caractères.")
    .max(50, "Le nom ne doit pas dépasser 50 caractères."),
  phone: z.string()
    .min(1, "Le numéro de téléphone est obligatoire.")
    .refine((val) => {
      const clean = val.replace(/[\s\-\.\(\)\+]/g, '');
      const senegalPhoneRegex = /^(221)?(70|75|76|77|78|79|33)\d{7}$/;
      return senegalPhoneRegex.test(clean);
    }, {
      message: "Numéro de téléphone invalide. Ex: 77 123 45 67 (9 chiffres)."
    }),
  address: z.string()
    .min(1, "Le quartier de Thiès est obligatoire.")
    .refine((val) => val !== 'Sélectionner votre quartier', {
      message: "Veuillez sélectionner votre quartier dans la liste."
    }),
  pin: z.string()
    .min(1, "Le code secret est obligatoire.")
    .regex(/^\d{4}$/, "Le code secret doit comporter 4 chiffres."),
  confirmPin: z.string()
    .min(1, "Veuillez confirmer le code secret."),
}).refine((data) => data.pin === data.confirmPin, {
  message: "Les codes secrets ne correspondent pas.",
  path: ["confirmPin"],
});

export const studentSchema = z.object({
  firstName: z.string()
    .min(1, "Le prénom de l'élève est obligatoire.")
    .min(2, "Le prénom doit contenir au moins 2 caractères."),
  lastName: z.string()
    .min(1, "Le nom de famille est obligatoire.")
    .min(2, "Le nom doit contenir au moins 2 caractères."),
  sex: z.enum(['M', 'F']),
  birthDate: z.string()
    .min(1, "La date de naissance est obligatoire.")
    .refine((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const now = new Date();
      return date < now;
    }, {
      message: "La date de naissance doit être dans le passé."
    }),
  levelId: z.string().min(1, "La classe/niveau est obligatoire."),
});

export type ParentFormErrors = Partial<Record<keyof z.infer<typeof parentSchema>, string>>;
export type StudentFormErrors = Partial<Record<keyof z.infer<typeof studentSchema>, string>>;

export function validateParent(data: any): { success: boolean; errors?: ParentFormErrors } {
  const result = parentSchema.safeParse(data);
  if (result.success) return { success: true };
  
  const errors: ParentFormErrors = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path[0] as keyof z.infer<typeof parentSchema>;
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });
  return { success: false, errors };
}

export function validateStudent(data: any): { success: boolean; errors?: StudentFormErrors } {
  const result = studentSchema.safeParse(data);
  if (result.success) return { success: true };
  
  const errors: StudentFormErrors = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path[0] as keyof z.infer<typeof studentSchema>;
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });
  return { success: false, errors };
}
