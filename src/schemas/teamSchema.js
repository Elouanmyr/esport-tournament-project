import { z } from 'zod'

export const teamSchema = z.object({
  name: z.string().min(3, 'Le nom doit faire au moins 3 caractères').max(50),
  tag: z.string().min(3, 'Le tag doit faire au moins 3 caractères').max(5, 'Le tag doit faire au maximum 5 caractères').regex(/^[A-Z0-9]+$/, "Le tag doit être en majuscules et chiffres uniquement")
})