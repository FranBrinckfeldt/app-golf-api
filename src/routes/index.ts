import Router from '@koa/router'
import { Context } from 'koa'

const router = new Router()

router.get('/', (ctx:Context): void => {
  ctx.body = 'holi mundi'
})

export default router
