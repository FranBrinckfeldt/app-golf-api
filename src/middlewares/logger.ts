import { Context, Next, Middleware } from 'koa'
import getStatusColor from '../utils/statusColor'

const logger: Middleware = async (ctx: Context, next: Next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} [\x1b[${getStatusColor(ctx.status)}m${ctx.status}\x1b[0m] ${ctx.url} - ${rt}`)
}

export default logger
