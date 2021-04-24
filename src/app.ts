import Koa from 'koa'
import koaBody from 'koa-body'
import cors from '@koa/cors'

import router from './routes'

// init
const app: Koa = new Koa()

// middlewares
app.use(koaBody({ jsonLimit: '1kb' }))
app.use(cors())

// routes
app.use(router.routes())
app.use(router.allowedMethods())

export default app
