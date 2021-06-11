import Router from '@koa/router'
import ResultController from '../controllers/ResultController'
import objectIdValidator from '../middlewares/objectIdValidator'

const router = new Router()
const controller = new ResultController()

router
  .get('/', controller.findAll)
  .get('/:id', objectIdValidator, controller.findById)
  .post('/', controller.insert)
  .put('/:id', objectIdValidator, controller.update)
  .delete('/:id', objectIdValidator, controller.delete)

export default router
