import { Context } from 'koa'
import { isValidObjectId } from 'mongoose'
import { filter, findIndex, insert, uniq } from 'ramda'
import Challenge from '../models/Challenge'
import Result from '../models/Result'
import Tournament from '../models/Tournament'

class ResultController {
  findAll = async (ctx: Context): Promise<void> => {
    const results = await Result.find()
    ctx.body = results
  }

  findById = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const result = await Result.findById(id)
    if (!result) {
      ctx.throw(404)
    }
    ctx.body = result
  }

  insert = async (ctx: Context): Promise<void> => {
    const payload = ctx.request.body
    const newResult = new Result(payload)
    const res = await newResult.save()
    ctx.body = res
    ctx.status = 201
  }

  winner = async (ctx: Context): Promise<void> => {
    const { challengeId } = ctx.params
    const { user } = ctx.state
    if (!isValidObjectId(challengeId)) {
      ctx.throw(400, 'Bad ID')
    }
    const challenge = await Challenge.findById(challengeId)
    if (user.sub !== String(challenge.challenged) && user.sub !== String(challenge.challenger)) {
      ctx.throw(403)
    }
    const looserId = String(challenge.challenged) === user.sub
      ? challenge.challenger
      : challenge.challenged
    const result = new Result({
      challenge: challengeId,
      winner: user.sub,
      looser: looserId
    })
    await result.save()
    ctx.status = 201
  }

  confirm = async (ctx: Context): Promise<void> => {
    const { resultId } = ctx.params
    const { user } = ctx.state
    if (!isValidObjectId(resultId)) {
      ctx.throw(400, 'Bad ID')
    }
    const result = await Result.findById(resultId).populate('challenge').exec()
    if (user.role !== 'ADMIN' && user.sub !== String(result.looser)) {
      ctx.throw(403)
    }
    const tournamentId = result.challenge.tournament
    const tournament = await Tournament.findById(tournamentId)
    if (!tournament) {
      ctx.throw(404)
    }
    if (!tournament.participants) {
      ctx.throw(500, 'Torneo sin participantes')
    }
    await Result.findByIdAndUpdate(resultId, {
      confirm: true
    })
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

    ctx.status = 201
  }

  update = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const payload = ctx.request.body
    const res = await Result.findByIdAndUpdate(id, payload)
    ctx.body = res
  }

  delete = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const res = await Result.findByIdAndDelete(id)
    ctx.body = res
  }
}

export default ResultController
