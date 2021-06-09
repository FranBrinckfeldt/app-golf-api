import { Context } from 'koa'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import { tokenSign } from '../utils/jwt'

const SALT_WORK_FACTOR = 10

class AuthController {
  login = async (ctx: Context): Promise<void> => {
    const payload = ctx.request.body
    if (payload) {
      const user = await User.findOne({ email: payload.email })
      if (user) {
        const passwordMatch = await bcrypt.compare(payload.password, user.password)
        if (passwordMatch) {
          const token = tokenSign(user)
          ctx.body = {
            accessToken: token
          }
          return
        }
      }
    }
    ctx.throw(401, 'INVALID_CREDENTIALS')
  }

  createPassword = async (ctx: Context): Promise<void> => {
    const userId = ctx.state.user.sub
    const payload = ctx.request.body
    const userToUpdate = await User.findById(userId)
    if (userToUpdate) {
      try {
        if (userToUpdate.password) {
          ctx.throw(401)
        }
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
        const password = await bcrypt.hash(payload.password, salt)
        await User.findByIdAndUpdate(userId, { password })
        ctx.status = 204
      } catch (error) {
        console.error(error)
      }
    } else {
      ctx.throw(404)
    }
  }
}

export default AuthController
