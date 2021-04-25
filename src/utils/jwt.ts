/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken'

const PRIVATE_KEY = process.env.SECRET_KEY || 'secret'

export interface TokenPayload {
  _id: string
  firstname: string
  lastname: string
  email: string
}

export interface TokenDecoded extends TokenPayload {
  sub: string
  exp: number
}

export const tokenVerify = (bearerToken: string): TokenDecoded => {
  if (bearerToken.includes('Bearer')) {
    const token = bearerToken.split(' ')[1]
    return jwt.verify(token, PRIVATE_KEY) as TokenDecoded
  }
  throw Error('No bearer token')
}

export const tokenSign = (payload: TokenPayload): string => {
  const tokenPayload = {
    sub: payload._id
  }
  return jwt.sign(tokenPayload, PRIVATE_KEY, { expiresIn: '1h' })
}
