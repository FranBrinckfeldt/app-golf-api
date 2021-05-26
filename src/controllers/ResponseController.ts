import { Context } from 'koa'
import { isEmpty } from 'ramda'
import Challenge from '../models/Challenge'
import Response from '../models/Response'

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
    if (challenge?.challenged.toString() !== ctx.state.user.sub) {
      ctx.throw(403)
    }
    if (isEmpty(payload.reason)) {
      ctx.throw(400, 'reason cant be empty')
    }
    const newResponse = new Response({
      challenge: idChallenge,
      reason: payload.reason,
      message: payload.message
    })
    const res = await newResponse.save()
    ctx.body = res
    ctx.status = 201
  }
}

export default ResponseController
