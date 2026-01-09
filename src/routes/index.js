import { Router } from 'express'
import authRoutes from './authRoutes.js'
import tournamentRoutes from './tournamentRoutes.js'
import teamRoutes from './teamRoutes.js'
import registrationRoutes from './registrationRoutes.js'
import userRoutes from './userRoutes.js'    

const router = Router()

router.use('/auth', authRoutes)
router.use('/tournaments', tournamentRoutes)
router.use('/teams', teamRoutes)
router.use('/registrations', registrationRoutes)
router.use('/users', userRoutes)

export default router