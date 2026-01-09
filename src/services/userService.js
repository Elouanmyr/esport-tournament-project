import prisma from '../config/prisma.js'

export const findAll = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true
    }
  })
}

export const findById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, email: true, role: true }
  })
}

export const remove = async (id) => {
  return prisma.user.delete({ where: { id } })
}