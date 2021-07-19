/* eslint-disable no-underscore-dangle */
import { Context } from 'koa'
import { endOfMonth, startOfMonth } from 'date-fns'
import Challenge from '../models/Challenge'
import Response from '../models/Response'
import Result from '../models/Result'
import { onNewChallenge } from '../events'

const checkDisponibility = async (ctx: Context) => {
  const { idTournament, idOponent } = ctx.params
  const challenges = await Challenge.find({
    tournament: idTournament,
    $or: [
      { challenger: { $in: [ctx.state.user.sub, idOponent] } },
      { challenged: { $in: [ctx.state.user.sub, idOponent] } }
    ]
  }, { _id: 1 })
  const challengesIds: string[] = challenges.map((item: { _id: string }) => String(item._id))

  const declinedResponses = await Response.find({
    challenge: { $in: challengesIds },
    accept: false
  }, { challenge: 1 })

  const declinedChallengesIds: string[] = declinedResponses.map(
    (item: { challenge: string }) => String(item.challenge)
  )

  const acceptedResponses = await Response.find({
    challenge: { $in: challengesIds },
    accept: true
  }, { challenge: 1 })

  const results = await Result.find({
    challenge: { $in: challengesIds }
  }, { challenge: 1 })

  const acceptedChallengeIds: string[] = acceptedResponses.map(
    (item: { challenge: string }) => String(item.challenge)
  )
  const resultsChallengeIds: string[] = results.map(
    (item: { challenge: string }) => String(item.challenge)
  )

  const allResponses = [...acceptedChallengeIds, ...declinedChallengesIds]

  const pendingResponses = challengesIds.filter(challengeId => (
    !allResponses.find(id => challengeId === id)
  ))

  const hasPendingMatches = !acceptedChallengeIds.every(
    resp => resultsChallengeIds.find(result => result === resp)
  )

  const monthStart = startOfMonth(new Date())
  const monthEnd = endOfMonth(new Date())

  const alreadyChallengedThisMonth = await Challenge.exists({
    tournament: idTournament,
    date: { $gt: monthStart.toISOString(), $lt: monthEnd.toISOString() },
    challenger: { $in: [ctx.state.user.sub, idOponent] },
    challenged: { $in: [ctx.state.user.sub, idOponent] }
  })

  if ((challenges.length > 0 && hasPendingMatches)
    || pendingResponses.length > 0
    || alreadyChallengedThisMonth
  ) {
    ctx.throw(409, 'CONFLICT')
  }
}

class ChallengeController {
  findAll = async (ctx: Context): Promise<void> => {
    const challenges = await Challenge.find()
    ctx.body = challenges
  }

  findById = async (ctx: Context): Promise<void> => {
    const { id } = ctx.params
    const challenge = await Challenge.findById(id)
    if (!challenge) {
      ctx.throw(404)
    }
    ctx.body = challenge
  }

  checkDisponibility = async (ctx: Context): Promise<void> => {
    await checkDisponibility(ctx)
    ctx.status = 200
  }

  request = async (ctx: Context): Promise<void> => {
    const { idTournament, idOponent } = ctx.params
    const payload = ctx.request.body
    await checkDisponibility(ctx)

    const newChallenge = new Challenge({
      tournament: idTournament,
      date: payload.date,
      place: payload.place,
      challenger: ctx.state.user.sub,
      challenged: idOponent
    })
    const res = await newChallenge.save()
    onNewChallenge(newChallenge)
    ctx.body = res
    ctx.status = 201
  }
}

export default ChallengeController
