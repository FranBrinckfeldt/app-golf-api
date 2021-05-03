import mongoose from 'mongoose'

const Location = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
}, { _id: false })

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
  },
  location: {
    type: Location,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

export default mongoose.model('User', UserSchema)
