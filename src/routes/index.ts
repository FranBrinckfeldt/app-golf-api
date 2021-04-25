import Router from '@koa/router'
import { Context } from 'koa'
import authRouter from './authRouter'

const router = new Router()

router.get('/', (ctx:Context): void => {
  ctx.body = 'holi mundi'
})

router.use(authRouter.routes())

export default router
