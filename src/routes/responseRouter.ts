import Router from '@koa/router'
import ResponseController from '../controllers/ResponseController'
import objectIdValidator from '../middlewares/objectIdValidator'

const router = new Router()
const controller = new ResponseController()

router
  .get('/', controller.findAll)
  .get('/:id', objectIdValidator, controller.findById)
  .post('/accept/:idChallenge', controller.accept)
  .post('/decline/:idChallenge', controller.decline)

export default router
