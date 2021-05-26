import Router from '@koa/router'
import { Context } from 'koa'
import tokenValidation from '../middlewares/tokenValidation'
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
router.use('/challenges', tokenValidation, challengeRouter.routes())
router.use('/competitors', tokenValidation, competitorRouter.routes())
router.use('/places', tokenValidation, placeRouter.routes())
router.use('/responses', tokenValidation, responseRouter.routes())
router.use('/results', tokenValidation, resultRouter.routes())
router.use('/tournaments', tokenValidation, tournamentRouter.routes())
router.use('/users', tokenValidation, userRouter.routes())

export default router
