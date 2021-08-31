import mongoose from 'mongoose'
import closeChallenges from './jobs/closeChallenges'
import server from './server'

const PORT = process.env.PORT || 4000

mongoose.connect(process.env.MONGO_URI || '', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.info('Mongo is connected')
    closeChallenges()
  })
  .catch(() => {
    console.error('Error while connecting Mongo')
  })

server.listen(PORT, () => {
  console.info(`Server listening on PORT ${PORT}`)
})
