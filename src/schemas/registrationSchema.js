import { z } from 'zod'

export const registrationSchema = z.object({
  tournamentId: z.coerce.number().int().positive('ID tournoi invalide'),
  playerId: z.coerce.number().int().positive().optional(),
  teamId: z.coerce.number().int().positive().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'REJECTED', 'WITHDRAWN']).optional()
}).refine(data => (data.playerId && !data.teamId) || (data.teamId && !data.playerId), {
  message: "Vous devez fournir soit un ID de joueur, soit un ID d'équipe, mais pas les deux",
  path: ['playerId']
})