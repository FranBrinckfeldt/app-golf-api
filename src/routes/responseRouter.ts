import Router from '@koa/router'
import ResponseController from '../controllers/ResponseController'

const router = new Router()
const controller = new ResponseController()

router
  .get('/', controller.findAll)
  .get('/:id', controller.findById)
  .post('/', controller.insert)
  .put('/:id', controller.update)
  .delete('/:id', controller.delete)

export default router
