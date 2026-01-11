import * as teamService from '../services/teamService.js'
import { asyncHandler } from '../utils/asyncHandler.js' 
import * as response from '../utils/responseHelper.js'

export const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await teamService.findAll()
  res.json(response.success(teams))
})

export const getTeamById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const team = await teamService.findById(id)
  
  if (!team) {
    return res.status(404).json(response.error('Équipe non trouvée', 404))
  }
  
  res.json(response.success(team))
})

export const createTeam = asyncHandler(async (req, res) => {
  const team = await teamService.create(req.body, req.user.userId)
  res.status(201).json(response.created(team))
})

export const updateTeam = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const team = await teamService.update(id, req.body, req.user.userId)
  res.json(response.success(team))
})

export const deleteTeam = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  await teamService.remove(id, req.user.userId)
  res.status(204).send()
})