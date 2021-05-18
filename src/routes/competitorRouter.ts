import Router from '@koa/router'
import CompetitorController from '../controllers/CompetitorController'

const router = new Router()
const controller = new CompetitorController()

router
  .get('/', controller.findAll)
  .get('/:id', controller.findById)
  .post('/', controller.insert)
  .put('/:id', controller.update)
  .delete('/:id', controller.delete)

export default router
