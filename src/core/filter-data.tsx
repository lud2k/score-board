import {Data, Id} from '../model/models'
import * as _ from 'lodash'

export const filterByGameId = (gameId: Id, data: Data): Data => {
  // filter data, only keeps entries related to gameId
  const games = _.pickBy(data.games, {id: gameId})
  const gameScores = _.pickBy(data.scores, {gameId})
  const gamePlayerIds = _.uniq(_.flatten(_.map(gameScores,
    (score) => [score.playerId1, score.playerId2])))
  const gamePlayers = _.pickBy(data.players, (player) => _.includes(gamePlayerIds, player.id))
  return {players: gamePlayers, games: games, scores: gameScores}
}
