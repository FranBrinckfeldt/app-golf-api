import mongoose, { Schema } from 'mongoose'
import { uniq } from 'ramda'

const TournamentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  participants: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }
}, { timestamps: true })

// eslint-disable-next-line func-names
TournamentSchema.pre('save', function (next) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this as any).participants = uniq((this as any).participants)
  next()
})

export default mongoose.model('Tournament', TournamentSchema)
