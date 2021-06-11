import Router from '@koa/router'
import CompetitorController from '../controllers/CompetitorController'
import objectIdValidator from '../middlewares/objectIdValidator'

const router = new Router()
const controller = new CompetitorController()

router
  .get('/', controller.findAll)
  .get('/:id', objectIdValidator, controller.findById)
  .post('/', controller.insert)
  .put('/:id', objectIdValidator, controller.update)
  .delete('/:id', objectIdValidator, controller.delete)

export default router
