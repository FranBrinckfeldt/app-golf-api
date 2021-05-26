import mongoose, { Schema } from 'mongoose'

const ResponseSchema = new mongoose.Schema({
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
    unique: true
  },
  accept: {
    type: Boolean,
    default: false
  },
  reason: {
    type: String
  },
  message: {
    type: String
  }
}, { timestamps: true })

export default mongoose.model('Response', ResponseSchema)
