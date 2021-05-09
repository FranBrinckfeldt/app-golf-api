import Router from '@koa/router'
import TournamentController from '../controllers/TournamentController'

const router = new Router()
const controller = new TournamentController()

router
  .get('/', controller.findAll)
  .get('/:id', controller.findById)
  .post('/', controller.insert)
  .put('/:id', controller.update)
  .delete('/:id', controller.delete)

export default router
