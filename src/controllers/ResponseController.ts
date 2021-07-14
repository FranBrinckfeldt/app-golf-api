import { Context } from 'koa'
import { filter, findIndex, insert, isEmpty, uniq } from 'ramda'
import Challenge from '../models/Challenge'
import Response from '../models/Response'
import Result from '../models/Result'
import Tournament from '../models/Tournament'

class ResponseController {
  findAll = async (ctx: Context): Promise<void> => {
    const responses = await Response.find()
    ctx.body = responses
  }

  findById = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const response = await Response.findById(id)
    if (!response) {
      ctx.throw(404)
    }
    ctx.body = response
  }

  accept = async (ctx: Context): Promise<void> => {
    const { idChallenge } = ctx.params
    const challenge = await Challenge.findById(idChallenge)
    if (challenge?.challenged.toString() !== ctx.state.user.sub) {
      ctx.throw(403)
    }
    const newResponse = new Response({
      challenge: idChallenge,
      accept: true
    })
    const res = await newResponse.save()
    ctx.body = res
    ctx.status = 201
  }

  decline = async (ctx: Context): Promise<void> => {
    const { idChallenge } = ctx.params
    const payload = ctx.request.body
    const challenge = await Challenge.findById(idChallenge)
    if (String(challenge?.challenged) !== ctx.state.user.sub) {
      ctx.throw(403)
    }
    if (isEmpty(payload.reason)) {
      ctx.throw(400, 'reason cant be empty')
    }
    const newResponse = new Response({
      challenge: idChallenge,
      reason: payload.reason,
      message: payload.message,
      accept: false
    })
    await newResponse.save()

    if (payload.reason === 'otro') {
      const result = new Result({
        challenge: idChallenge,
        winner: challenge.challenger,
        looser: ctx.state.user.sub,
        confirm: true
      })
      await result.save()
      const tournamentId = challenge.tournament
      const tournament = await Tournament.findById(tournamentId)
      if (!tournament) {
        ctx.throw(404)
      }
      if (!tournament.participants) {
        ctx.throw(500, 'Torneo sin participantes')
      }
      tournament.participants = uniq(tournament.participants)

      const looserIndex = findIndex(
        val => String(val) === String(result.looser),
        tournament.participants
      )

      const winnerIndex = findIndex(
        val => String(val) === String(result.winner),
        tournament.participants
      )

      if (winnerIndex > looserIndex) {
        if (looserIndex === -1) {
          ctx.throw(400, 'Perdedor no existe en los participantes')
        }
        const indexToInsert = looserIndex === 0 ? looserIndex : looserIndex - 1

        const ladderWithoutWinner = filter(
          val => String(val) !== String(result.winner),
          tournament.participants
        )
        const newLadder = insert(indexToInsert + 1, result.winner, ladderWithoutWinner)

        await Tournament.findByIdAndUpdate(tournamentId, {
          $set: { participants: newLadder }
        })
      }
    }

    ctx.status = 201
  }
}

export default ResponseController
