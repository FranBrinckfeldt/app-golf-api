import Router from '@koa/router'
import UserController from '../controllers/UserController'
import objectIdValidator from '../middlewares/objectIdValidator'

const router = new Router()
const controller = new UserController()

router
  .get('/', controller.findAll)
  .get('/:id', objectIdValidator, controller.findById)
  .post('/', controller.registerUser)
  .put('/:id', objectIdValidator, controller.update)
  .delete('/:id', objectIdValidator, controller.delete)

export default router
