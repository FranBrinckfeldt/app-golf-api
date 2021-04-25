import { Context } from 'koa'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import { tokenSign } from '../utils/jwt'

const SALT_WORK_FACTOR = 10

class AuthController {
  login = async (ctx:Context): Promise<void> => {
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

  register = async (ctx:Context): Promise<void> => {
    const payload = ctx.request.body
    if (payload) {
      try {
        const newUser = new User(payload)
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
        newUser.password = await bcrypt.hash(payload.password, salt)
        await newUser.save()
        ctx.status = 201
        ctx.body = newUser
      } catch (error) {
        console.error(error)
      }
    }
  }
}

export default AuthController
