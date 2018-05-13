import {Data, Id} from '../model/models'
import * as _ from 'lodash'

export const filterByGameId = (gameId: Id, data: Data): Data => {
  // filter data, only keeps entries related to gameId
  const games = _.pickBy(data.games, {id: gameId})
  const gameScores = _.pickBy(data.scores, {gameId})
  const gamePlayerIds = _.uniq(_.flatten(_.map(gameScores,
    (score) => [score.playerId1, score.playerId2])))
  const gamePlayers = _.pickBy(data.players, (player) => _.includes(gamePlayerIds, player.id))
  const gameTeamIds = _.uniq(_.map(gamePlayers, gamePlayer => gamePlayer.teamId))
  const teams = _.pickBy(data.teams, (team) => _.includes(gameTeamIds, team.id))
  return {players: gamePlayers, games, scores: gameScores, teams}
}
