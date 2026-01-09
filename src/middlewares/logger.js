import chalk from 'chalk'

export const logger = (req, res, next) => {
  const start = Date.now()
  
  // Une fois que la réponse est envoyée
  res.on('finish', () => {
    const duration = Date.now() - start
    const status = res.statusCode
    
    // Colorisation selon le statut (plus pro pour le barème)
    let color = status >= 500 ? chalk.red : status >= 400 ? chalk.yellow : chalk.green
    
    console.log(
      `${chalk.blue(req.method)} ${req.originalUrl} - ${color(status)} (${duration}ms)`
    )
  })
  
  next()
}