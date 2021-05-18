import { Context } from 'koa'
import Competitor from '../models/Competitor'

class CompetitorController {
  findAll = async (ctx: Context): Promise<void> => {
    const competitors = await Competitor.find()
    ctx.body = competitors
  }

  findById = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const competitor = await Competitor.findById(id)
    if (!competitor) {
      ctx.throw(404)
    }
    ctx.body = competitor
  }

  insert = async (ctx: Context): Promise<void> => {
    const payload = ctx.request.body
    const newCompetitor = new Competitor(payload)
    const res = await newCompetitor.save()
    ctx.body = res
    ctx.status = 201
  }

  update = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const payload = ctx.request.body
    const res = await Competitor.findByIdAndUpdate(id, payload)
    ctx.body = res
  }

  delete = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const res = await Competitor.findByIdAndDelete(id)
    ctx.body = res
  }
}

export default CompetitorController
