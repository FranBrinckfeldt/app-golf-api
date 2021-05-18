import { Context } from 'koa'
import Place from '../models/Place'

class PlaceController {
  findAll = async (ctx: Context): Promise<void> => {
    const places = await Place.find()
    ctx.body = places
  }

  findById = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const place = await Place.findById(id)
    if (!place) {
      ctx.throw(404)
    }
    ctx.body = place
  }

  insert = async (ctx: Context): Promise<void> => {
    const payload = ctx.request.body
    const newPlace = new Place(payload)
    const res = await newPlace.save()
    ctx.body = res
    ctx.status = 201
  }

  update = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const payload = ctx.request.body
    const res = await Place.findByIdAndUpdate(id, payload)
    ctx.body = res
  }

  delete = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const res = await Place.findByIdAndDelete(id)
    ctx.body = res
  }
}

export default PlaceController
