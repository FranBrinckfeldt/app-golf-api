import { Context } from 'koa'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import { tokenSign } from '../utils/jwt'

const SALT_WORK_FACTOR = 10

class UserController {
  findAll = async (ctx: Context): Promise<void> => {
    const { emailq } = ctx.query
    if (emailq) {
      const users = await User.find({ email: { $regex: `${emailq}` } })
      ctx.body = users
    } else {
      const users = await User.find()
      ctx.body = users
    }
  }

  findById = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const user = await User.findById(id)
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  }

  registerUser = async (ctx: Context): Promise<void> => {
    const payload = ctx.request.body
    if (payload) {
      try {
        const newUser = new User(payload)
        if (newUser.password) {
          const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
          newUser.password = await bcrypt.hash(payload.password, salt)
        }
        await newUser.save()
        const token = tokenSign(newUser)
        ctx.status = 201
        ctx.body = {
          accessToken: token
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  update = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const payload = ctx.request.body
    const res = await User.findByIdAndUpdate(id, payload)
    ctx.body = res
  }

  switchActive = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const prevState = await User.findById(id)
    const res = await User.findByIdAndUpdate(id, { active: !prevState.active })
    ctx.body = res
  }

  delete = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const res = await User.findByIdAndDelete(id)
    ctx.body = res
  }
}

export default UserController
