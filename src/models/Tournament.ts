import mongoose, { Schema } from 'mongoose'

const Player = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  place: {
    type: Number,
    default: 0
  }
}, { _id: false })

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
  ladder: {
    type: [Player],
    required: true
  }
}, { timestamps: true })

export default mongoose.model('Tournament', TournamentSchema)
