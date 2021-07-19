import Router from '@koa/router'
import NotificationController from '../controllers/NotificationController'

const router = new Router()
const controller = new NotificationController()

router
  .get('/', controller.findAll)
  .delete('/:key', controller.delete)

export default router
