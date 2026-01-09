import { hashPassword, comparePassword } from '../utils/cryptoHelper.js'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.js'
import { env } from '../config/env.js'

// hasher pwd avec crypto natif

export const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET)

export const register = async (userData) => {
  // Vérifier si email ou username existe déjà
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: userData.email }, { username: userData.username }]
    }
  })

  if (existing) {
    if (existing.email === userData.email) {
      throw new Error('Cet email est déjà utilisé')
    }
    if (existing.username === userData.username) {
      throw new Error("Ce nom d'utilisateur est déjà pris")
    }
  }

  const hashedPassword = await hashPassword(userData.password)
  return prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
      role: userData.role || 'PLAYER'
    },
    select: { id: true, username: true, email: true, role: true }
  })
}

export const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error('Email ou mot de passe incorrect')
  }
  const token = jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
  return { token, user: { id: user.id, username: user.username, role: user.role } }
}

export const generateToken = (user) => {
  return jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
}

export const getUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, email: true, role: true }
  })
}