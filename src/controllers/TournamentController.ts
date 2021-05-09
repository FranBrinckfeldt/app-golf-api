import { Context } from 'koa'
import Tournament from '../models/Tournament'

class TournamentController {
  findAll = async (ctx: Context): Promise<void> => {
    const tournaments = await Tournament.find()
    ctx.body = tournaments
  }

  findById = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const tournament = await Tournament.findById(id)
    if (!tournament) {
      ctx.throw(404)
    }
    ctx.body = tournament
  }

  insert = async (ctx: Context): Promise<void> => {
    const payload = ctx.request.body
    const newTournament = new Tournament(payload)
    const res = await newTournament.save()
    ctx.body = res
  }

  update = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const payload = ctx.request.body
    const res = await Tournament.findByIdAndUpdate(id, payload)
    ctx.body = res
  }

  delete = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const res = await Tournament.findByIdAndDelete(id)
    ctx.body = res
  }
}

export default TournamentController
