import { createError, eventHandler, readBody } from 'h3'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { invalid_type_error, required_error, invalid_email, invalid_min_length } from '~/server/error-message'
import User from '~/db/models/user.d'

export default eventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  // Validation
  const result = z
    .object({
      email: z.string({ invalid_type_error, required_error }).email(invalid_email),
      password: z.string({ invalid_type_error, required_error }).min(8, invalid_min_length)
    }).safeParse(await readBody(event))

  // Handling error
  if (!result.success) {
    throw createError({
      statusCode: 403,
      statusMessage: JSON.stringify(result.error.format())
    })
  }

  const expiresIn = 60 * 1440 // 24 Hours
  const { email, password } = result.data

  // Query by email
  const user = await User.findOne({
    where: {
      email: email
    },
    attributes: ['id', 'fullName', 'email', 'password', 'avaUrl', 'roleId']
  })

  // Handle Wrong Params
  if (user == null) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email atau Password salah.'
    })
  }

  // Generate Token
  const accessToken = jwt.sign({ ...user, scope: ['test', 'user'] }, config.public.jwt_key, {
    expiresIn
  })
  const refreshToken = jwt.sign({ ...user, scope: ['test', 'user'] }, config.public.jwt_key, {
    expiresIn: 60 * (1440 * 2)
  })

  return {
    token: accessToken,
    refreshToken: refreshToken,
    user: user
  }
})