import { Router } from 'express'
import * as registrationController from '../controllers/registrationController.js'
import { authenticate } from '../middlewares/authenticate.js'
import { authorize } from '../middlewares/authorize.js'
import { validate } from '../middlewares/validate.js'
import { registrationSchema } from '../schemas/registrationSchema.js'

const router = Router({ mergeParams: true })

/**
 * @swagger
 * /api/tournaments/{tournamentId}/register:
 *   post:
 *     summary: Register for a tournament
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playerId:
 *                 type: integer
 *               teamId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Registration created
 */
router.post('/register', authenticate, validate(registrationSchema), registrationController.create)

/**
 * @swagger
 * /api/tournaments/{tournamentId}/registrations:
 *   get:
 *     summary: List registrations for a tournament
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: List of registrations
 */
router.get('/registrations', registrationController.getByTournament)

/**
 * @swagger
 * /api/tournaments/{tournamentId}/registrations/{id}:
 *   patch:
 *     summary: Update registration status
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, REJECTED, WITHDRAWN]
 *     responses:
 *       200:
 *         description: Registration updated
 *   delete:
 *     summary: Cancel a registration (PENDING only)
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Registration cancelled
 */
router.patch('/registrations/:id/status', authenticate, authorize('ORGANIZER', 'ADMIN'), registrationController.updateStatus)
router.delete('/registrations/:id', authenticate, registrationController.remove)

export default router