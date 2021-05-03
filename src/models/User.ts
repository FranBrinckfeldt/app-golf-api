import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'PLAYER'],
    default: 'PLAYER'
  }
}, { timestamps: true })

export default mongoose.model('User', UserSchema)
