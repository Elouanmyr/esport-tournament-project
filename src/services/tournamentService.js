import prisma from '../config/prisma.js'

export const findAll = (filters) => {
  const { status, game, format, page = 1, limit = 10 } = filters
  const skip = (parseInt(page) - 1) * parseInt(limit)
  
  return prisma.tournament.findMany({
    where: { status, game, format },
    include: { organizer: { select: { username: true } } },
    skip,
    take: parseInt(limit)
  })
}

export const create = async (data, organizerId) => {
  // check que la date est dans le futur
  if (new Date(data.startDate) <= new Date()) {
    throw new Error('La date de début doit être dans le futur')
  }
  return prisma.tournament.create({
    data: { ...data, organizerId, status: 'DRAFT' }
  })
}

export const findById = (id) => prisma.tournament.findUnique({ 
  where: { id },
  include: { registrations: true, organizer: { select: { username: true, id: true } } } 
})

export const update = async (id, data) => {
  const tournament = await findById(id)
  
  if (!tournament) {
    throw new Error('Tournoi non trouvé')
  }
  
  // bloque si completed ou cancelled
  if (tournament.status === 'COMPLETED' || tournament.status === 'CANCELLED') {
    throw new Error(`Un tournoi ${tournament.status} ne peut pas être modifié`)
  }
  
  // Validation des dates
  if (data.startDate && new Date(data.startDate) <= new Date()) {
    throw new Error('La date de début doit être dans le futur')
  }
  
  if (data.endDate && data.startDate) {
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      throw new Error('La date de fin doit être après la date de début')
    }
  } else if (data.endDate && tournament.startDate) {
    if (new Date(data.endDate) <= new Date(tournament.startDate)) {
      throw new Error('La date de fin doit être après la date de début')
    }
  }
  
  return prisma.tournament.update({
    where: { id },
    data,
    include: { organizer: { select: { username: true } } }
  })
}

export const remove = async (id) => {
  const tournament = await findById(id)
  
  if (!tournament) {
    throw new Error('Tournoi non trouvé')
  }
  
  // Protection: Impossible de supprimer un tournoi ayant des inscriptions CONFIRMED
  const confirmedRegistrations = tournament.registrations.filter(r => r.status === 'CONFIRMED')
  if (confirmedRegistrations.length > 0) {
    throw new Error('Impossible de supprimer un tournoi avec des inscriptions confirmées')
  }
  
  return prisma.tournament.delete({ where: { id } })
}

export const updateStatus = async (id, newStatus, userId, userRole) => {
  const tournament = await findById(id)
  
  if (!tournament) {
    throw new Error('Tournoi non trouvé')
  }
  
  const currentStatus = tournament.status
  
  // Vérifier les transitions autorisées
  if (currentStatus === 'DRAFT' && newStatus === 'OPEN') {
    // DRAFT → OPEN : Vérifier que startDate > maintenant
    if (new Date(tournament.startDate) <= new Date()) {
      throw new Error('La date de début doit être dans le futur pour ouvrir le tournoi')
    }
  } else if (currentStatus === 'OPEN' && newStatus === 'ONGOING') {
    // OPEN → ONGOING : Vérifier qu'il y a au moins 2 participants CONFIRMED
    const confirmedCount = tournament.registrations.filter(r => r.status === 'CONFIRMED').length
    if (confirmedCount < 2) {
      throw new Error('Au moins 2 participants confirmés sont nécessaires pour démarrer le tournoi')
    }
  } else if (currentStatus === 'ONGOING' && newStatus === 'COMPLETED') {
    // ONGOING → COMPLETED : ADMIN uniquement
    if (userRole !== 'ADMIN') {
      throw new Error('Seul un administrateur peut marquer un tournoi comme terminé')
    }
  } else if (newStatus === 'CANCELLED') {
    // N'importe quel statut → CANCELLED : Créateur ou ADMIN
    if (tournament.organizerId !== userId && userRole !== 'ADMIN') {
      throw new Error('Seul le créateur ou un administrateur peut annuler ce tournoi')
    }
  } else if (currentStatus !== newStatus) {
    throw new Error(`Transition de ${currentStatus} à ${newStatus} non autorisée`)
  }
  
  return prisma.tournament.update({
    where: { id },
    data: { status: newStatus },
    include: { organizer: { select: { username: true } } }
  })
}