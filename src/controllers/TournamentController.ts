/* eslint-disable no-underscore-dangle */
import { Context } from 'koa'
import { filter, findIndex, insert, uniq } from 'ramda'
import Challenge from '../models/Challenge'
import Response from '../models/Response'
import Result from '../models/Result'
import Tournament from '../models/Tournament'

class TournamentController {
  findAll = async (ctx: Context): Promise<void> => {
    const tournaments = await Tournament.find()
    ctx.body = tournaments
  }

  findById = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const tournament = await Tournament.findById(id).populate('participants').exec()
    if (!tournament) {
      ctx.throw(404)
    }
    ctx.body = tournament
  }

  getChallengesByTournament = async (ctx: Context): Promise<void> => {
    const user = ctx.state.user
    const { id } = ctx.params
    const challenges = await Challenge.find({
      tournament: id,
      $or: [
        { challenger: user._id },
        { challenged: user._id }
      ]
    }).populate('challenged').populate('challenger').exec()
    const challengesIds = challenges.map((val: { _id: string }) => val._id)
    const responses = await Response.find({
      challenge: { $in: challengesIds }
    })
    const results = await Result.find({
      challenge: { $in: challengesIds }
    })
    const fullChallenges = challenges
      .map((val: Record<string, string | (() => Record<string, string>)>) => ({
        ...(val.toObject as () => Record<string, string>)(),
        result: results
          .find((result: Record<string, string>) => result.challenge === val._id),
        response: responses
          .find((response: Record<string, string>) => response.challenge === val._id)
      }))
    ctx.body = fullChallenges
  }

  insert = async (ctx: Context): Promise<void> => {
    const payload = ctx.request.body
    const newTournament = new Tournament(payload)
    const res = await newTournament.save()
    ctx.body = res
    ctx.status = 201
  }

  update = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const payload = ctx.request.body
    const res = await Tournament.findByIdAndUpdate(id, payload)
    ctx.body = res
  }

  setLadder = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const payload = ctx.request.body
    if (payload.participants) {
      payload.participants = uniq(payload.participants)
      const res = await Tournament.findByIdAndUpdate(id, {
        $set: { participants: payload.participants }
      })
      ctx.body = res
    }
  }

  ladderClimb = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const payload = ctx.request.body
    if (!payload.winner || !payload.looser) {
      ctx.throw(400)
    }
    const data = await Tournament.findById(id)
    if (!data) {
      ctx.throw(404)
    }
    if (data.participants) {
      data.participants = uniq(data.participants)
      const looserIndex = findIndex(val => String(val) === payload.looser, data.participants)
      if (looserIndex === -1) {
        ctx.throw(400, 'Perdedor no existe en los participantes')
      }
      const indexToInsert = looserIndex === 0 ? looserIndex : looserIndex - 1
      const ladderWithoutWinner = filter(val => String(val) !== payload.winner, data.participants)
      const newLadder = insert(indexToInsert, payload.winner, ladderWithoutWinner)
      const res = await Tournament.findByIdAndUpdate(id, {
        $set: { participants: newLadder }
      })
      ctx.body = res
    }
  }

  delete = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const res = await Tournament.findByIdAndDelete(id)
    ctx.body = res
  }
}

export default TournamentController
