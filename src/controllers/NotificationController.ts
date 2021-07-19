import { Context } from 'koa'
import getRedisClient from '../lib/getRedisClient'

class NotificationController {
  findAll = async (ctx: Context): Promise<void> => {
    const redis = getRedisClient()
    const { sub, role } = ctx.state.user
    let adminKeys: string[] = []
    const playerKeys = await redis.keys(`notification:${sub}:*`)
    if (role === 'ADMIN') {
      adminKeys = await redis.keys('notification:ADMIN:*')
    }
    const allKeys = [...playerKeys, ...adminKeys]
    const notifications: unknown[] = []
    await Promise.all(allKeys.map(async key => {
      const notification = await redis.hmget(key as string, ['id', 'message', 'createdAt'])
      if (notification[0]) {
        notifications.push({
          key,
          id: notification[0] || '',
          message: notification[1] || '',
          createdAt: Number(notification[2])
        })
      }
    }))
    ctx.body = notifications
  }

  delete = async (ctx: Context): Promise<void> => {
    const redis = getRedisClient()
    const { key } = ctx.params
    await redis.del(key)
    ctx.status = 204
  }
}

export default NotificationController
