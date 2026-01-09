import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Le pseudo doit faire au moins 3 caractères')
    .max(20, 'Le pseudo doit faire au maximum 20 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Le pseudo doit contenir uniquement des lettres, chiffres et underscores'),
  email: z.string().email('Format d\'email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit faire au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  role: z.enum(['PLAYER', 'ORGANIZER', 'ADMIN']).optional()
})

export const loginSchema = z.object({
  email: z.string().email('Format d’email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis')
})