import { Router } from 'express'
import * as tournamentController from '../controllers/tournamentController.js'
import { authenticate } from '../middlewares/authenticate.js'
import { authorize } from '../middlewares/authorize.js'
import { validate } from '../middlewares/validate.js'
import { tournamentSchema } from '../schemas/tournamentSchema.js'
import registrationRoutes from './registrationRoutes.js'

/**
 * @swagger
 * /api/tournaments:
 *   get:
 *     summary: Lister tous les tournois
 *     tags: [Tournaments]
 *     responses:
 *       200:
 *         description: Liste des tournois
 *   post:
 *     summary: Créer un nouveau tournoi
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               game:
 *                 type: string
 *               format:
 *                 type: string
 *               maxParticipants:
 *                 type: integer
 *               prizePool:
 *                 type: number
 *               startDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tournoi créé
 * /api/tournaments/{id}:
 *   get:
 *     summary: Obtenir un tournoi par ID
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Détails du tournoi
 *   put:
 *     summary: Modifier un tournoi
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Tournoi modifié
 *   delete:
 *     summary: Supprimer un tournoi
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Tournoi supprimé
 * /api/tournaments/{id}/status:
 *   patch:
 *     summary: Changer le statut d'un tournoi
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *                 enum: [OPEN, ONGOING, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const router = Router()

// Public : Voir les tournois
router.get('/', tournamentController.getAll)
router.get('/:id', tournamentController.getById)

// Protégé : Création et modification (de ORGANIZER/ADMIN)
router.post('/', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(tournamentSchema), tournamentController.create)
router.put('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(tournamentSchema), tournamentController.update)
router.delete('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), tournamentController.remove)
router.patch('/:id/status', authenticate, tournamentController.updateStatus)

// Registration routes
router.use('/:tournamentId', registrationRoutes)

export default router