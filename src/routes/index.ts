import Router from '@koa/router'
import { Context } from 'koa'
import authRouter from './authRouter'
import challengeRouter from './challengeRouter'
import competitorRouter from './competitorRouter'
import placeRouter from './placeRouter'
import responseRouter from './responseRouter'
import resultRouter from './resultRouter'
import tournamentRouter from './tournamentRouter'
import userRouter from './userRouter'

const router = new Router()

router.get('/', (ctx:Context): void => {
  ctx.body = 'holi mundi'
})

router.use(authRouter.routes())
router.use('/challenges', challengeRouter.routes())
router.use('/competitors', competitorRouter.routes())
router.use('/places', placeRouter.routes())
router.use('/responses', responseRouter.routes())
router.use('/results', resultRouter.routes())
router.use('/tournaments', tournamentRouter.routes())
router.use('/users', userRouter.routes())

export default router
