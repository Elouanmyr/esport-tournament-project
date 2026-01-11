import { Router } from 'express'
import * as userController from '../controllers/userController.js'
import { authenticate } from '../middlewares/authenticate.js'
import { authorize } from '../middlewares/authorize.js'

const router = Router()

// Seul l'ADMIN peut donc voir la liste des membres ou en supprimer
router.get('/', authenticate, authorize('ADMIN'), userController.getAll)
router.delete('/:id', authenticate, authorize('ADMIN'), userController.remove)

export default router