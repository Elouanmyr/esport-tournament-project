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
  res.json(response.success(team))
})

export const createTeam = asyncHandler(async (req, res) => {
  const team = await teamService.create(req.body, req.user.userId)
  res.status(201).json(response.success(team, "Équipe créée avec succès"))
})