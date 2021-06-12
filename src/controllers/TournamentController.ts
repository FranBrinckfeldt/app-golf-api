/* eslint-disable no-underscore-dangle */
import { Context } from 'koa'
import { filter, findIndex, insert, uniq } from 'ramda'
import Challenge from '../models/Challenge'
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
    const challengesSent = await Challenge.find({
      tournament: id,
      challenger: user._id
    }).populate('challenged').exec()
    const challengesReceived = await Challenge.find({
      tournament: id,
      challenged: user._id
    }).populate('challenger').exec()
    ctx.body = {
      sent: challengesSent,
      received: challengesReceived
    }
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
