import { v4 } from 'uuid'
import getPusherInstance from '../lib/getPusherInstance'
import getRedisClient from '../lib/getRedisClient'
import User from '../models/User'

const EXPIRATION_SECS = 604800 // 7 días = 604800 secs

export const onNewChallenge = async (challenge: Record<string, string>): Promise<void> => {
  const redis = getRedisClient()
  const pusher = getPusherInstance()
  const challenger = await User.findById(challenge.challenger)

  const notificationId = v4()
  const playerNotifications = `notification:${challenge.challenged}`
  const notificationKey = `${playerNotifications}:${notificationId}`
  const createdAt = Date.now()
  const notificationMessage = `Tienes un nuevo desafío de ${challenger.firstname} ${challenger.lastname} (${challenger.email})`

  await redis.hmset(notificationKey, [
    'id', notificationId,
    'message', notificationMessage,
    'createdAt', createdAt
  ])
  await redis.expire(notificationKey, EXPIRATION_SECS)

  pusher.trigger(String(challenge.challenged), 'new-challenge', {
    message: notificationMessage
  })
}

export const onNewChallengeResult = async (result: Record<string, string>): Promise<void> => {
  const redis = getRedisClient()
  const pusher = getPusherInstance()

  const winner = await User.findById(result.winner)
  const looser = await User.findById(result.looser)

  const createdAt = Date.now()
  const looserNotificationId = v4()
  const resultNotificationId = v4()

  const playerNotifications = `notification:${result.looser}`
  const adminNofications = 'notification:ADMIN'

  const looserNotificationKey = `${playerNotifications}:${looserNotificationId}`
  const looserMessage = `El jugador ${winner.firstname} ${winner.lastname} (${winner.email}) se ha declarado como vencedor. Confirma los resultados`

  const resultNotificationKey = `${adminNofications}:${resultNotificationId}`
  const resultMessage = `El jugador ${winner.firstname} ${winner.lastname} (${winner.email}) marca una victoria frente a ${looser.firstname} ${looser.lastname} (${looser.email})`

  await redis.hmset(looserNotificationKey, [
    'id', looserNotificationId,
    'message', looserMessage,
    'createdAt', createdAt
  ])
  await redis.expire(looserNotificationKey, EXPIRATION_SECS)

  await redis.hmset(resultNotificationKey, [
    'id', resultNotificationId,
    'message', resultMessage,
    'createdAt', createdAt
  ])
  await redis.expire(resultNotificationKey, EXPIRATION_SECS)

  pusher.trigger(String(result.looser), 'on-lose', {
    message: looserMessage
  })

  pusher.trigger('ADMIN', 'on-result', {
    message: resultMessage
  })
}
