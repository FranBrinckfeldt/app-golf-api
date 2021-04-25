import Router from '@koa/router'
import AuthController from '../controllers/AuthController'

const router = new Router()
const controller = new AuthController()

router
  .post('/login', controller.login)
  .post('/register', controller.register)

export default router
