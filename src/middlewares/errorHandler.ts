import { Middleware, Context, Next } from 'koa'

const errorHandler: Middleware = async (ctx: Context, next: Next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = { message: err.message }
    ctx.app.emit('error', err, ctx)
  }
}

export default errorHandler
