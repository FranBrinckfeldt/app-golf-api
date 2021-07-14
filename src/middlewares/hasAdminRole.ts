import { Context, Next, Middleware } from 'koa'

const hasAdminRole: Middleware = async (ctx: Context, next: Next) => {
  const { role } = ctx.state.user
  if (role !== 'ADMIN') {
    ctx.throw(403)
  }
  await next()
}

export default hasAdminRole
