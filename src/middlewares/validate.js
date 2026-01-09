export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      // Si la validation échoue, on renvoie les erreurs détaillées
      const errors = result.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      return res.status(400).json({
        success: false,
        errors,
      })
    }

    // Si tout est bon, on remplace le body par les données validées
    req.body = result.data
    next()
  }
}