import mongoose from 'mongoose'

const PlaceSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
}, { timestamps: true })

export default mongoose.model('Place', PlaceSchema)
