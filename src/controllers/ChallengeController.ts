import { Context } from 'koa'
import Challenge from '../models/Challenge'

class ChallengeController {
  findAll = async (ctx: Context): Promise<void> => {
    const challenges = await Challenge.find()
    ctx.body = challenges
  }

  findById = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const challenge = await Challenge.findById(id)
    if (!challenge) {
      ctx.throw(404)
    }
    ctx.body = challenge
  }

  insert = async (ctx: Context): Promise<void> => {
    const payload = ctx.request.body
    const newChallenge = new Challenge(payload)
    const res = await newChallenge.save()
    ctx.body = res
    ctx.status = 201
  }

  update = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const payload = ctx.request.body
    const res = await Challenge.findByIdAndUpdate(id, payload)
    ctx.body = res
  }

  delete = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const res = await Challenge.findByIdAndDelete(id)
    ctx.body = res
  }
}

export default ChallengeController
