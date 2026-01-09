import app from './app.js'
import { env } from './config/env.js'

const PORT = env.PORT || 3000

app.listen(PORT, () => {
  console.log(` Serveur démarré sur : http://localhost:${PORT}`)
  console.log(` Documentation disponible sur : http://localhost:${PORT}/api-docs`)
})