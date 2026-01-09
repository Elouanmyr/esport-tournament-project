export const success = (data) => ({
  success: true,
  data
})

export const created = (data) => ({
  success: true,
  data
})

export const error = (message, status = 500) => ({
  success: false,
  error: message
})