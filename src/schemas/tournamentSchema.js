import { z } from 'zod'

export const tournamentSchema = z.object({
  name: z.string().min(3, 'Nom trop court').max(100),
  game: z.string().min(1, 'Le nom du jeu est requis'),
  format: z.enum(['SOLO', 'TEAM'], { errorMap: () => ({ message: "Le format doit être SOLO ou TEAM" }) }),
  maxParticipants: z.coerce.number().int().min(2, 'Minimum 2 participants'),
  prizePool: z.coerce.number().min(0, 'Le cashprize ne peut pas être négatif'),
  startDate: z.coerce.date().refine(date => date > new Date(), {
    message: "La date de début doit être dans le futur"
  }),
  endDate: z.coerce.date().optional()
}).refine(data => !data.endDate || data.endDate > data.startDate, {
  message: "La date de fin doit être après la date de début",
  path: ['endDate']
})