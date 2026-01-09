import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { notFound } from './middlewares/notFound.js'
import { logger } from './middlewares/logger.js'
import { icon } from './utils/iconHelper.js'

const app = express()

// Middlewares de base
app.use(cors())
app.use(express.json()) //
app.use(express.static('src/public')) //
app.use(logger) //

// Vue EJS
app.set('view engine', 'ejs')
app.set('views', 'src/views')
app.locals.icon = icon

// Route d'accueil (arcade)
app.get('/', (req, res) => {
  res.render('pages/home')
})

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes API
app.use('/api', routes) //

// Gestion des erreurs (doit être à la fin)
app.use(notFound) //
app.use(errorHandler) //

export default app