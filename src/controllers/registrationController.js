import * as registrationService from '../services/registrationService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as response from '../utils/responseHelper.js'

export const create = asyncHandler(async (req, res) => {
  const registration = await registrationService.create(req.body, req.user.userId)
  res.status(201).json(response.created(registration))
})

export const getByTournament = asyncHandler(async (req, res) => {
  const tournamentId = parseInt(req.params.tournamentId)
  const registrations = await registrationService.findByTournament(tournamentId)
  res.json(response.success(registrations))
})

export const updateStatus = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const { status } = req.body
  const registration = await registrationService.updateStatus(id, status)
  res.json(response.success(registration))
})

export const remove = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  await registrationService.remove(id)
  res.status(204).send()
})