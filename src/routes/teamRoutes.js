import { Router } from 'express'
import * as teamController from '../controllers/teamController.js'
import { authenticate } from '../middlewares/authenticate.js'

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Lister toutes les équipes
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: Liste des équipes
 *   post:
 *     summary: Créer une nouvelle équipe
 *     tags: [Teams]
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
 *               tag:
 *                 type: string
 *     responses:
 *       201:
 *         description: Équipe créée
 * /api/teams/{id}:
 *   get:
 *     summary: Obtenir une équipe par ID
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Détails de l'équipe
 */

const router = Router()

router.get('/', teamController.getAllTeams)
router.get('/:id', teamController.getTeamById)
router.post('/', authenticate, teamController.createTeam)

export default router