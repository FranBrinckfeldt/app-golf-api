import Router from '@koa/router'
import TournamentController from '../controllers/TournamentController'
import objectIdValidator from '../middlewares/objectIdValidator'

const router = new Router()
const controller = new TournamentController()

router
  .get('/', controller.findAll)
  .get('/:id', objectIdValidator, controller.findById)
  .get('/:id/challenges', objectIdValidator, controller.getChallengesByTournament)
  .post('/', controller.insert)
  .put('/:id', objectIdValidator, controller.update)
  .put('/:id/set-ladder', objectIdValidator, controller.setLadder)
  .put('/:id/ladder-climb', objectIdValidator, controller.ladderClimb)
  .delete('/:id', objectIdValidator, controller.delete)

export default router
