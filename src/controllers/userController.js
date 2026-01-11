import * as userService from '../services/userService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as response from '../utils/responseHelper.js'

export const getAll = asyncHandler(async (req, res) => {
  const users = await userService.findAll()
  res.json(response.success(users))
})

export const remove = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  
  // Sécurité -> on ne peut pas se supprimer soi-même
  if (id === req.user.userId) {
    return res.status(400).json(response.error('Impossible de supprimer votre propre compte', 400))
  }

  await userService.remove(id)
  res.status(204).send()
})