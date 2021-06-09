import Router from '@koa/router'
import AuthController from '../controllers/AuthController'
import tokenValidation from '../middlewares/tokenValidation'

const router = new Router()
const controller = new AuthController()

router
  .post('/login', controller.login)
  .put('/create-password', tokenValidation, controller.createPassword)

export default router
