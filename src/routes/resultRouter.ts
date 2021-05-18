import Router from '@koa/router'
import ResultController from '../controllers/ResultController'

const router = new Router()
const controller = new ResultController()

router
  .get('/', controller.findAll)
  .get('/:id', controller.findById)
  .post('/', controller.insert)
  .put('/:id', controller.update)
  .delete('/:id', controller.delete)

export default router
