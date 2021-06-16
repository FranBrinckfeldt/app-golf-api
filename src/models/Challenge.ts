import mongoose, { Schema } from 'mongoose'

const ChallengeSchema = new Schema({
  tournament: {
    type: Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  challenger: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challenged: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

export default mongoose.model('Challenge', ChallengeSchema)
