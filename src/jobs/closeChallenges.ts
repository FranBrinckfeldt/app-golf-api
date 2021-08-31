/* eslint-disable no-underscore-dangle */
import Agenda from 'agenda'
import { sub } from 'date-fns'
import { filter, findIndex, insert, uniq } from 'ramda'
import Challenge from '../models/Challenge'
import Response from '../models/Response'
import Result from '../models/Result'
import Tournament from '../models/Tournament'

export default async (): Promise<void> => {
  const agenda = new Agenda({ db: { address: process.env.MONGO_AGENDA || '' } })

  agenda.define('closeChallenges', async () => {
    const challenges = await Challenge.find({ createdAt: { $lte: sub(new Date(), { hours: 48 }) } })
    const challengeIds = challenges.map((item: { _id: string }) => String(item._id))
    const responses = await Response.find({ challenge: { $in: challengeIds } })
    const challengesToClose = challenges.filter((item: { _id: string }) => (
      !responses.find((res: { challenge: string }) => String(res.challenge) === String(item._id))
    ))
    await Promise.all(challengesToClose.forEach(async (item: {
      _id: string,
      tournament: string,
      challenger: string,
      challenged: string
    }) => {
      const newResponse = new Response({
        challenge: item._id,
        reason: 'default',
        message: 'No se respondió al desafío',
        accept: false
      })
      await newResponse.save()
      const result = new Result({
        challenge: item._id,
        winner: item.challenger,
        looser: item.challenged,
        confirm: true
      })
      await result.save()
      const tournamentId = item.tournament
      const tournament = await Tournament.findById(tournamentId)
      if (tournament) {
        tournament.participants = uniq(tournament.participants)

        const looserIndex = findIndex(
          val => String(val) === String(result.looser),
          tournament.participants
        )

        const winnerIndex = findIndex(
          val => String(val) === String(result.winner),
          tournament.participants
        )

        if (winnerIndex > looserIndex) {
          const indexToInsert = looserIndex === 0 ? looserIndex : looserIndex - 1

          const ladderWithoutWinner = filter(
            val => String(val) !== String(result.winner),
            tournament.participants
          )
          const newLadder = insert(indexToInsert + 1, result.winner, ladderWithoutWinner)

          await Tournament.findByIdAndUpdate(tournamentId, {
            $set: { participants: newLadder }
          })
        }
      }
    }))
  })

  agenda.start().then(() => {
    agenda.every('1 minute', 'closeChallenges')
  })
}
