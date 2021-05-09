import Koa from 'koa'
import koaBody from 'koa-body'
import cors from '@koa/cors'

import router from './routes'
import logger from './middlewares/logger'
import responseTime from './middlewares/responseTime'

// init
const app: Koa = new Koa()

// middlewares
app.use(koaBody({ jsonLimit: '1kb' }))
app.use(cors())
app.use(logger)
app.use(responseTime)

// routes
app.use(router.routes())
app.use(router.allowedMethods())

export default app
