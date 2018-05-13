
import * as glicko2 from 'glicko2'
import {PlayerRanking, Data, GameStats, GamesStats} from '../model/models'
import * as _ from 'lodash'
import {filterByGameId} from './filter-data'

export const computeGameRankings = (data: Data): GamesStats => {
  return _.mapValues(data.games, (game) => computeRankings(filterByGameId(game.id, data)))
}


export const computeRankings = (data: Data): GameStats => {
  const config = { tau : 0.5, rating : 1500, rd : 200, vol : 0.06 }
  const ranking = new glicko2.Glicko2(config)
  const teamRanking = new glicko2.Glicko2(config)
  const scoresByDate = _.groupBy(_.values(data.scores), 'date')
  const dates = _.sortBy(_.keys(scoresByDate), 'date')

  // Create players and teams
  const players = {}
  const teams = {}
  _.values(data.players).forEach((player) => {
    if (!players[player.id]) {
      players[player.id] = ranking.makePlayer()
      players[player.id].playerId = player.id
    }
    if (!teams[player.teamId]) {
      teams[player.teamId] = teamRanking.makePlayer()
      teams[player.teamId].teamId = player.teamId
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

    const teamScores = scoresByDate[date].map((score) => [
      teams[data.players[score.playerId1].teamId],
      teams[data.players[score.playerId2].teamId],
      score.score1 > score.score2 ? 1 : 0,
    ])

    ranking.updateRatings(scores)
    teamRanking.updateRatings(teamScores)

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

  const teamStats = teamRanking.getPlayers()
  const teamRankings = teamStats.map((stat: any) => ({
    rating: stat.getRating(),
    deviation: stat.getRd(),
    volatility: stat.getVol(),
    teamId: stat.teamId,
  }))

  return {
    rankingsByDate: rankings,
    rankings: _.orderBy(rankings[_.last(dates)], ['rating'], ['desc'])
  }
}
