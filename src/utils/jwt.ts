/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken'

const PRIVATE_KEY = process.env.SECRET_KEY || 'secret'

export interface TokenPayload {
  _id: string
  email: string
  role: string
  active: boolean
  sub?: string
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
  const tokenPayload: TokenPayload = {
    sub: payload._id,
    _id: payload._id,
    email: payload.email,
    role: payload.role,
    active: payload.active
  }
  return jwt.sign(tokenPayload, PRIVATE_KEY, { expiresIn: '1h' })
}
