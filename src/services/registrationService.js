import prisma from '../config/prisma.js'

/**
 * Créer une inscription avec validation complète du format et du statut du tournoi
 * Vérifie:
 * - L'existence et l'état du tournoi (OPEN)
 * - La cohérence entre format tournoi (SOLO/TEAM) et type d'inscription
 * - Que le capitaine inscrit son équipe (pour TEAM)
 * - Que la limite de participants n'est pas atteinte
 * - Qu'il n'y a pas d'inscription dupliquée
 */
export const create = async (data, userId) => {
  const { tournamentId, playerId, teamId } = data

  // 1. Récupérer le tournoi et compter les inscriptions confirmées
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: { registrations: { where: { status: 'CONFIRMED' } } }
  })

  if (!tournament) throw new Error('Tournoi non trouvé')
  if (tournament.status !== 'OPEN') {
    throw new Error('Les inscriptions ne sont possibles que pour les tournois ouverts')
  }

  // 2. Valider la cohérence format tournoi vs type d'inscription
  if (tournament.format === 'SOLO') {
    if (!playerId || teamId) {
      throw new Error('Un tournoi SOLO n’accepte que des joueurs individuels') // 
    }
  } else if (tournament.format === 'TEAM') {
    if (!teamId || playerId) {
      throw new Error('Un tournoi TEAM n’accepte que des équipes') // [cite: 940]
    }    
    // Seul le capitaine de l'équipe peut l'inscrire au tournoi
    const team = await prisma.team.findUnique({ where: { id: teamId } })
    if (!team || team.captainId !== userId) {
      throw new Error('Seul le capitaine peut inscrire l\'équipe')
    }  }

  // 3. Vérifier que la limite de participants n'est pas dépassée
  if (tournament.registrations.length >= tournament.maxParticipants) {
    throw new Error('Le nombre maximum de participants est atteint')
  }

  // 4. Empêcher les inscriptions dupliquées (même joueur/équipe ne peut s'inscrire qu'une fois)
  const existing = await prisma.registration.findFirst({
    where: {
      tournamentId,
      OR: [
        { playerId: playerId || -1 },
        { teamId: teamId || -1 }
      ]
    }
  })
  if (existing) throw new Error('Déjà inscrit à ce tournoi')

  // 5. Créer l'inscription avec statut PENDING (en attente de confirmation)
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
 * Récupérer toutes les inscriptions d'un tournoi avec les détails du joueur ou équipe
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
 * Mettre à jour le statut d'une inscription
 * Statuts valides: PENDING → CONFIRMED → WITHDRAWN
 * ou PENDING → REJECTED
 * Enregistre la date de confirmation si passage à CONFIRMED
 */
export const updateStatus = async (id, newStatus) => {
  const registration = await prisma.registration.findUnique({
    where: { id }
  })
  
  if (!registration) {
    throw new Error('Inscription non trouvée')
  }

  // Vérifier que le statut est valide
  const validStatuses = ['PENDING', 'CONFIRMED', 'REJECTED', 'WITHDRAWN']
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Statut invalide')
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
 * Supprimer une inscription (uniquement si statut PENDING)
 * Les inscriptions CONFIRMED ne peuvent pas être supprimées directement
 * Utilisez updateStatus pour les passer au statut WITHDRAWN
 */
export const remove = async (id) => {
  const registration = await prisma.registration.findUnique({
    where: { id }
  })
  
  if (!registration) {
    throw new Error('Inscription non trouvée')
  }

  if (registration.status === 'CONFIRMED') {
    throw new Error('Impossible de supprimer une inscription CONFIRMED. Utilisez PATCH pour la changer en WITHDRAWN.')
  }
  
  return prisma.registration.delete({
    where: { id }
  })
}