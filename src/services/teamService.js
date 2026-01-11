import prisma from '../config/prisma.js'

export const create = async (data, captainId) => {
  // Vérifie si le nom ou le tag est déjà pris 
  const existing = await prisma.team.findFirst({
    where: { OR: [{ name: data.name }, { tag: data.tag }] }
  })
  if (existing) throw new Error('Le nom ou le tag est déjà utilisé')

  return prisma.team.create({
    data: { ...data, captainId },
    include: { captain: { select: { username: true } } }
  })
}

export const findAll = () => prisma.team.findMany({
  include: { captain: { select: { username: true, id: true } } }
})

export const findById = (id) => prisma.team.findUnique({
  where: { id },
  include: { 
    captain: { select: { username: true, id: true } },
    registrations: true
  }
})

export const update = async (id, data, userId) => {
  const team = await findById(id)
  
  if (!team) {
    throw new Error('Équipe non trouvée')
  }
  
  // Vérifier que le capitaine est celui qui modifie
  if (team.captain.id !== userId) {
    throw new Error('Seul le capitaine peut modifier l\'équipe')
  }
  
  // Vérifier l'unicité du nom/tag
  if (data.name || data.tag) {
    const existing = await prisma.team.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { OR: [
            { name: data.name },
            { tag: data.tag }
          ]}
        ]
      }
    })
    if (existing) throw new Error('Le nom ou le tag est déjà utilisé')
  }
  
  return prisma.team.update({
    where: { id },
    data,
    include: { captain: { select: { username: true } } }
  })
}

export const remove = async (id, userId) => {
  const team = await findById(id)
  
  if (!team) {
    throw new Error('Équipe non trouvée')
  }
  
  // Vérifier que le capitaine est celui qui supprime
  if (team.captain.id !== userId) {
    throw new Error('Seul le capitaine peut supprimer l\'équipe')
  }
  
  // Protection: Impossible de supprimer si inscrite à un tournoi OPEN ou ONGOING
  const activeRegistration = team.registrations.find(r => {
    return r.tournamentId  
  })
  
  if (team.registrations.length > 0) {
    throw new Error('Impossible de supprimer une équipe inscrite à un tournoi')
  }
  
  return prisma.team.delete({ where: { id } })
}