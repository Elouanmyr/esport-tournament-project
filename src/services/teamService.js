import prisma from '../config/prisma.js'

export const create = async (data, captainId) => {
  // Vérifie si le nom ou le tag est déjà pris 
  const existing = await prisma.team.findFirst({
    where: { OR: [{ name: data.name }, { tag: data.tag }] }
  })
  if (existing) throw new Error('Le nom ou le tag est déjà utilisé')

  return prisma.team.create({
    data: { ...data, captainId }
  })
}

export const findAll = () => prisma.team.findMany({
  include: { captain: { select: { username: true } } }
})