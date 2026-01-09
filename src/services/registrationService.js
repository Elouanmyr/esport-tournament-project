import prisma from '../config/prisma.js'

/**
 * Créer une inscription avec toutes les vérifications métier
 * [cite: 937, 938, 939, 941, 942, 943]
 */
export const create = async (data) => {
  const { tournamentId, playerId, teamId } = data

  // 1. Vérifier si le tournoi existe et son statut [cite: 938]
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: { registrations: { where: { status: 'CONFIRMED' } } }
  })

  if (!tournament) throw new Error('Tournoi non trouvé')
  if (tournament.status !== 'OPEN') {
    throw new Error('Les inscriptions ne sont possibles que pour les tournois ouverts') // [cite: 938]
  }

  // 2. Vérifier la cohérence du format (SOLO vs TEAM) [cite: 939, 941]
  if (tournament.format === 'SOLO') {
    if (!playerId || teamId) {
      throw new Error('Un tournoi SOLO n’accepte que des joueurs individuels') // 
    }
  } else if (tournament.format === 'TEAM') {
    if (!teamId || playerId) {
      throw new Error('Un tournoi TEAM n’accepte que des équipes') // [cite: 940]
    }
  }

  // 3. Vérifier la limite de participants [cite: 942]
  if (tournament.registrations.length >= tournament.maxParticipants) {
    throw new Error('Le nombre maximum de participants est atteint') // [cite: 942]
  }

  // 4. Vérifier l'unicité (ne pas s'inscrire deux fois) [cite: 943]
  const existing = await prisma.registration.findFirst({
    where: {
      tournamentId,
      OR: [
        { playerId: playerId || -1 },
        { teamId: teamId || -1 }
      ]
    }
  })
  if (existing) throw new Error('Déjà inscrit à ce tournoi') // [cite: 943]

  // 5. Création de l'inscription [cite: 933]
  return prisma.registration.create({
    data: {
      tournamentId,
      playerId,
      teamId,
      status: 'PENDING'
    }
  })
}

/**
 * List registrations for a tournament
 */
export const findByTournament = (tournamentId) => {
  return prisma.registration.findMany({
    where: { tournamentId },
    include: {
      player: { select: { username: true } },
      team: { select: { name: true, tag: true } }
    }
  })
}

/**
 * Update registration status (for organizer or participant)
 * CONFIRMED cannot be deleted via DELETE, but can be changed to WITHDRAWN via PATCH
 */
export const updateStatus = async (id, newStatus) => {
  const registration = await prisma.registration.findUnique({
    where: { id }
  })
  
  if (!registration) {
    throw new Error('Registration not found')
  }
  
  // Check valid status transitions
  const validStatuses = ['PENDING', 'CONFIRMED', 'REJECTED', 'WITHDRAWN']
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Invalid status')
  }
  
  return prisma.registration.update({
    where: { id },
    data: { 
      status: newStatus,
      confirmedAt: newStatus === 'CONFIRMED' ? new Date() : registration.confirmedAt
    }
  })
}

/**
 * Delete a registration (only if PENDING)
 * CONFIRMED registrations cannot be deleted, but can be withdrawn via updateStatus
 */
export const remove = async (id) => {
  const registration = await prisma.registration.findUnique({
    where: { id }
  })
  
  if (!registration) {
    throw new Error('Registration not found')
  }
  
  if (registration.status === 'CONFIRMED') {
    throw new Error('Cannot delete a CONFIRMED registration. Use PATCH to change status to WITHDRAWN instead.')
  }
  
  return prisma.registration.delete({
    where: { id }
  })
}