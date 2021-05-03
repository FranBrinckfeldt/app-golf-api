import mongoose, { Schema } from 'mongoose'

const CompetitorSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tournament: {
    type: Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  place: {
    type: Number,
    default: 0
  },
  matches: {
    type: Number,
    default: 0
  },
  win: {
    type: Number,
    default: 0
  },
  lost: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

export default mongoose.model('Competitor', CompetitorSchema)
