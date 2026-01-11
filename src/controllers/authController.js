import * as authService from '../services/authService.js'
import { asyncHandler } from '../utils/asyncHandler.js' // 
import * as response from '../utils/responseHelper.js'

/**
 * POST /api/auth/register
 * Créer un utilisateur et retourner un JWT 
 */
export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body)
  
  // On génère le token après l'inscription 
  const token = authService.generateToken(user)

  res.status(201).json({
    success: true,
    message: 'Inscription réussie',
    user,
    token
  })
})

/**
 * POST /api/auth/login
 * Vérifier les identifiants et retourner un JWT [cite: 891]
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const result = await authService.login(email, password)

  res.json({
    success: true,
    message: 'Connexion réussie',
    user: result.user,
    token: result.token
  })
})

/**
 * GET /api/auth/profile
 * Récupérer les informations de l'utilisateur connecté
 */
export const getProfile = asyncHandler(async (req, res) => {
  // L'utilisateur est déjà attaché à req.user par le middleware authenticate
  const user = await authService.getUserById(req.user.userId)
  
  if (!user) {
    return res.status(404).json(response.error('Utilisateur non trouvé', 404))
  }
  
  res.json(response.success(user))
})