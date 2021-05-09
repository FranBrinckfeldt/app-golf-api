import { Context, Middleware, Next } from 'koa'

const responseTime: Middleware = async (ctx: Context, next: Next): Promise<void> => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
}

export default responseTime
