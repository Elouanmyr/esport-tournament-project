export const errorHandler = (err, req, res, _next) => {
  console.error('Erreur attrapée:', err.message)

  const statusCode = err.status || 500

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Erreur interne du serveur',
  })
}