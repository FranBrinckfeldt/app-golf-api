import Router from '@koa/router'
import PlaceController from '../controllers/PlaceController'

const router = new Router()
const controller = new PlaceController()

router
  .get('/', controller.findAll)
  .get('/:id', controller.findById)
  .post('/', controller.insert)
  .put('/:id', controller.update)
  .delete('/:id', controller.delete)

export default router
