import { Context } from 'koa'
import Result from '../models/Result'

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
