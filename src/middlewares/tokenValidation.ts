import { Context, Next, Middleware } from 'koa'
import { tokenVerify } from '../utils/jwt'

const tokenValidation: Middleware = async (ctx: Context, next: Next) => {
  const bearerToken = ctx.get('Authorization')
  try {
    const decodedToken = tokenVerify(bearerToken)
    ctx.state.user = decodedToken
  } catch (err) {
    ctx.throw(403, err.message)
  }
  await next()
}

export default tokenValidation
