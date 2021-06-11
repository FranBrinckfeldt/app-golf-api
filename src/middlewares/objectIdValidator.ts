import { Context, Next, Middleware } from 'koa'
import { isValidObjectId } from 'mongoose'

const objectIdValidator: Middleware = async (ctx: Context, next: Next) => {
  const { id } = ctx.params
  if (!isValidObjectId(id)) {
    ctx.throw(400, 'Bad ID')
  }
  await next()
}

export default objectIdValidator
