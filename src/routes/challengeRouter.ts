import Router from '@koa/router'
import ChallengeController from '../controllers/ChallengeController'
import objectIdValidator from '../middlewares/objectIdValidator'

const router = new Router()
const controller = new ChallengeController()

router
  .get('/', controller.findAll)
  .get('/:id', objectIdValidator, controller.findById)
  .post('/request/:idTournament/:idOponent', controller.request)
  // .put('/:id', controller.update)
  // .delete('/:id', controller.delete)

export default router
