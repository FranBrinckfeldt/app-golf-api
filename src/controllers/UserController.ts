import { Context } from 'koa'
import User from '../models/User'

class UserController {
  findAll = async (ctx: Context): Promise<void> => {
    const users = await User.find()
    ctx.body = users
  }

  findById = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const user = await User.findById(id)
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  }

  insert = async (ctx: Context): Promise<void> => {
    const payload = ctx.request.body
    const newUser = new User(payload)
    const res = await newUser.save()
    ctx.body = res
    ctx.status = 201
  }

  update = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const payload = ctx.request.body
    const res = await User.findByIdAndUpdate(id, payload)
    ctx.body = res
  }

  delete = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const res = await User.findByIdAndDelete(id)
    ctx.body = res
  }
}

export default UserController
