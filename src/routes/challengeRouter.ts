import Router from '@koa/router'
import ChallengeController from '../controllers/ChallengeController'

const router = new Router()
const controller = new ChallengeController()

router
  .get('/', controller.findAll)
  .get('/:id', controller.findById)
  .post('/request/:idTournament/:idOponent', controller.request)
  // .put('/:id', controller.update)
  // .delete('/:id', controller.delete)

export default router
