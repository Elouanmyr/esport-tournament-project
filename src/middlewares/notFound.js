/**
 * 404 Not Found middleware
 * Must be registered after all routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée: ${req.method} ${req.url}`)
  error.status = 404
  next(error)
}