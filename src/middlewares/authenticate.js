import { verifyToken } from '../services/authService.js'

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization

  // On vérifie si le token est présent dans l'en-tête "Authorization"
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Token manquant' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // On décode le token pour savoir qui est l'utilisateur
    const decoded = verifyToken(token)
    req.user = decoded // On attache l'utilisateur à la requête
    return next()
  } catch {
    return res.status(401).json({ success: false, error: 'Token invalide' })
  }
}