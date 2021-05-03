import mongoose, { Schema } from 'mongoose'

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
  }
}, { timestamps: true })

export default mongoose.model('Tournament', TournamentSchema)
