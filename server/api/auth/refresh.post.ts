import { createError, eventHandler, readBody } from 'h3'
import jwt from 'jsonwebtoken'

interface User {
  username: string;
  name: string;
  picture: string;
}

interface JwtPayload extends User {
  scope: Array<'test' | 'user'>;
  exp: number;
}

export default eventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  
  const body = await readBody<{ refreshToken: string }>(event)

  if (!body.refreshToken) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized, no refreshToken in payload'
    })
  }

  const decoded = jwt.verify(body.refreshToken, config.public.jwt_key) as JwtPayload | undefined

  if (!decoded) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized, refreshToken can`t be verified'
    })
  }

  const expiresIn = 60 * 1440 // 1 Day

  const user: User = {
    username: decoded.username,
    picture: decoded.picture,
    name: decoded.name
  }

  const accessToken = jwt.sign({ ...user, scope: ['test', 'user'] }, config.public.jwt_key, {
    expiresIn
  })
  const refreshToken = jwt.sign({ ...user, scope: ['test', 'user'] }, config.public.jwt_key, {
    expiresIn: 60 * (1440 * 2)
  })

  return {
    token: accessToken,
    refreshToken: refreshToken
  }
})