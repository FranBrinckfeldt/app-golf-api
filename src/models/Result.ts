import mongoose, { Schema } from 'mongoose'

const PlayerResult = new mongoose.Schema({
  points: {
    type: Number,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false
  }
}, { _id: false })

const ResultSchema = new mongoose.Schema({
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
    unique: true
  },
  challenger: {
    type: PlayerResult,
    required: true
  },
  challenged: {
    type: PlayerResult,
    required: true
  }
}, { timestamps: true })

export default mongoose.model('Result', ResultSchema)
