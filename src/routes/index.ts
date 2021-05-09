import Router from '@koa/router'
import { Context } from 'koa'
import authRouter from './authRouter'
import tournamentRouter from './tournamentRouter'

const router = new Router()

router.get('/', (ctx:Context): void => {
  ctx.body = 'holi mundi'
})

router.use(authRouter.routes())
router.use('/tournaments', tournamentRouter.routes())

export default router
