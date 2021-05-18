import { Context } from 'koa'
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

  insert = async (ctx: Context): Promise<void> => {
    const payload = ctx.request.body
    const newResponse = new Response(payload)
    const res = await newResponse.save()
    ctx.body = res
    ctx.status = 201
  }

  update = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const payload = ctx.request.body
    const res = await Response.findByIdAndUpdate(id, payload)
    ctx.body = res
  }

  delete = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const res = await Response.findByIdAndDelete(id)
    ctx.body = res
  }
}

export default ResponseController
