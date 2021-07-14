import mongoose, { Schema } from 'mongoose'

const ResultSchema = new mongoose.Schema({
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
    unique: true
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  looser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  confirm: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

export default mongoose.model('Result', ResultSchema)
