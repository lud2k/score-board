
import * as glicko2 from 'glicko2'
import {PlayerRankingsByDate, PlayerRanking, Data} from '../model/models'
import * as _ from 'lodash'

export const computeRankings = (data: Data): {rankingsByDate: PlayerRankingsByDate,
  rankings: PlayerRanking[]} => {

  const ranking = new glicko2.Glicko2({ tau : 0.5, rating : 1500, rd : 200, vol : 0.06 })
  const scoresByDate = _.groupBy(_.values(data.scores), 'date')
  const dates = _.sortBy(_.keys(scoresByDate), 'date')

  // Create players
  const players = {}
  _.values(data.players).forEach((player) => {
    if (!players[player.id]) {
      players[player.id] = ranking.makePlayer()
      players[player.id].playerId = player.id
    }
  })

  const rankings = {}
  let minRating = Number.MAX_VALUE
  let maxRating = 0
  dates.forEach((date) => {
    const scores = scoresByDate[date].map((score) => [
      players[score.playerId1],
      players[score.playerId2],
      score.score1 > score.score2 ? 1 : 0,
    ])

    ranking.updateRatings(scores)
    const stats = ranking.getPlayers()
    rankings[date] = stats.map((stat: any) => ({
      date,
      rating: stat.getRating(),
      deviation: stat.getRd(),
      volatility: stat.getVol(),
      playerId: stat.playerId,
    }))

    // Sort and add rank and normalizedRating
    rankings[date] = _.sortBy<PlayerRanking>(rankings[date], 'rating')
    minRating = Math.min(minRating, _.first<PlayerRanking>(rankings[date]).rating)
    maxRating = Math.max(maxRating, _.last<PlayerRanking>(rankings[date]).rating)
  })
  dates.forEach((date) => {
    rankings[date].forEach((playerRanking: PlayerRanking, index: number) => {
      playerRanking.rank = index
      playerRanking.normalizedRating = (playerRanking.rating-minRating)/(maxRating-minRating)
    })
  })
  return {
    rankingsByDate: rankings,
    rankings: rankings[_.last(dates)],
  }
}
