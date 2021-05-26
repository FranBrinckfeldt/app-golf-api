import Router from '@koa/router'
import ResponseController from '../controllers/ResponseController'

const router = new Router()
const controller = new ResponseController()

router
  .get('/', controller.findAll)
  .get('/:id', controller.findById)
  .post('/accept/:idChallenge', controller.accept)
  .post('/decline/:idChallenge', controller.decline)

export default router
