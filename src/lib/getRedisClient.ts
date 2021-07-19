import Redis from 'ioredis'

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '0', 10),
  password: process.env.REDIS_PASSWORD
})

export default (): Redis.Redis => redisClient
