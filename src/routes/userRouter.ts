import Router from '@koa/router'
import UserController from '../controllers/UserController'

const router = new Router()
const controller = new UserController()

router
  .get('/', controller.findAll)
  .get('/:id', controller.findById)
  .post('/', controller.insert)
  .put('/:id', controller.update)
  .delete('/:id', controller.delete)

export default router
