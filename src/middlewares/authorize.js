export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Non authentifié' })
    }

    // On vérifie si le rôle de l'utilisateur est dans la liste autorisée
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Accès interdit' })
    }

    next()
  }
}