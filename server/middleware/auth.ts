import { createError, eventHandler, getRequestHeader, H3Event } from 'h3'
import jwt from 'jsonwebtoken'

const TOKEN_TYPE = 'Bearer'

const extractToken = (authHeaderValue: string) => {
  const [, token] = authHeaderValue.split(`${TOKEN_TYPE} `)
  return token
}

const ensureAuth = (event: H3Event) => {
  const authHeaderValue = getRequestHeader(event, 'authorization')
  if (typeof authHeaderValue === 'undefined') {
    throw createError({
      statusCode: 403,
      statusMessage:
        'Need to pass valid Bearer-authorization header to access this endpoint'
    })
  }

  const extractedToken = extractToken(authHeaderValue)
  try {
    const config = useRuntimeConfig(event)
    return jwt.verify(extractedToken, config.public.jwt_key)
  } catch (error) {
    console.error("Login failed. Here's the raw error:", error)
    throw createError({
      statusCode: 403,
      statusMessage: 'You must be logged in to use this endpoint'
    })
  }
}

export default defineEventHandler(async (event) => {
  let session: string | null
  if (event.path.startsWith('/api')) {
    if (!event.path.startsWith('/api/auth')) {
      const authHeaderValue = getRequestHeader(event, 'authorization')
      if (!authHeaderValue) {
        throw createError({ statusMessage: 'Unauthenticated', statusCode: 401 })
      }

      const user = ensureAuth(event)
      if (!user) {
        throw createError({ statusMessage: 'Token sudah kadaluarsa', statusCode: 401 })

      }
    }
  }
})
