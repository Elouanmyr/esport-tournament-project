import crypto from 'crypto'

// Simple hash avec crypto natif (pas bcrypt)
export const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export const comparePassword = async (password, hashedPassword) => {
  const [salt, originalHash] = hashedPassword.split(':')
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return hash === originalHash
}
