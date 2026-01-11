export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Non authentifié' })
    }

    // Check si le rôle de l'utilisateur est dans les rôles autorisés
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Accès interdit' })
    }

    next()
  }
}