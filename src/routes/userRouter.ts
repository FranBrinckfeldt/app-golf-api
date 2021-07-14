import Router from '@koa/router'
import UserController from '../controllers/UserController'
import hasAdminRole from '../middlewares/hasAdminRole'
import objectIdValidator from '../middlewares/objectIdValidator'

const router = new Router()
const controller = new UserController()

router
  .get('/', controller.findAll)
  .get('/:id', objectIdValidator, controller.findById)
  .post('/', hasAdminRole, controller.registerUser)
  .put('/:id', objectIdValidator, hasAdminRole, controller.update)
  .put('/:id/active', objectIdValidator, hasAdminRole, controller.switchActive)
  .delete('/:id', objectIdValidator, hasAdminRole, controller.delete)

export default router
