import * as dotenv from 'dotenv'
import Redis from 'ioredis'
dotenv.config()

const redisClient = new Redis(process.env.REDIS_URL)
export default redisClient
