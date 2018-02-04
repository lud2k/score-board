import {Game, GamesMap, Id, Player, PlayersMap, ScoresMap, Stats} from './models'
import * as _ from 'lodash'
import {memoize} from 'decko'
import {computeStats} from '../core/stats'

export class Data {
  players: PlayersMap
  games: GamesMap
  scores: ScoresMap
  stats: Stats

  constructor(players: PlayersMap, games: GamesMap, scores: ScoresMap) {
    this.players = players
    this.games = games
    this.scores = scores
  }

  @memoize()
  filterForGame(gameId: Id): Data {
    const games = _.pickBy(this.games, {id: gameId})
    const gameScores = _.pickBy(this.scores, {gameId})
    const gamePlayerIds = _.uniq(_.flatten(_.map(gameScores,
      (score) => [score.playerId1, score.playerId2])))
    const gamePlayers = _.pickBy(this.players, (player) => _.includes(gamePlayerIds, player.id))
    return new Data(
      gamePlayers,
      games,
      gameScores,
    )
  }

  getGameById(id: Id): Game {
    return this.games[id]
  }

  getPlayerById(id: Id): Player {
    return this.players[id]
  }

  getStats(): Stats {
    if (!this.stats) {
      this.stats = computeStats(this)
    }
    return this.stats
  }
}
