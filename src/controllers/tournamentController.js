import * as tournamentService from '../services/tournamentService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as response from '../utils/responseHelper.js'

export const getAll = asyncHandler(async (req, res) => {
  const tournaments = await tournamentService.findAll(req.query)
  res.json(response.success(tournaments))
})

export const getById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const tournament = await tournamentService.findById(id)
  res.json(response.success(tournament))
})

export const create = asyncHandler(async (req, res) => {
  // L'organisateur est l'utilisateur connecté récupéré par le middleware authenticate
  const tournament = await tournamentService.create(req.body, req.user.userId)
  res.status(201).json(response.created(tournament))
})

export const update = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const tournament = await tournamentService.update(id, req.body)
  res.json(response.success(tournament))
})

export const remove = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  await tournamentService.remove(id)
  res.status(204).send()
})

export const updateStatus = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const { status } = req.body
  
  if (!status) {
    return res.status(400).json(response.error('Le statut est requis'))
  }
  
  const tournament = await tournamentService.updateStatus(id, status, req.user.userId, req.user.role)
  res.json(response.success(tournament, `Statut du tournoi passé à ${status}`))
})