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
    type: String,
    required: true
  },
  message: {
    type: String
  }
}, { timestamps: true })

export default mongoose.model('Response', ResponseSchema)
