
import * as React from 'react'
import {AppConfig} from '../config'
import * as GoogleSheetsPublished from './google-sheets-published'
import * as RestApi from './rest-api'
import * as Random from './random'
import {Data, Player, Team} from '../model/models'
import * as randomColor from 'randomcolor'
import _ = require('lodash')

const generateColorsForPlayers = (data: Data): Data => {
  // generate random colors for players
  const colors = randomColor({
    luminosity: 'dark',
    count: _.size(data.players),
    seed: 15158731,
  })
  let index = 0
  _.forEach(data.players, (player: Player) => {
    if (!player.color) {
      player.color = colors[index++]
    }
  })

  return data
}

const validateTeams = (data: Data): void => {
  _.forEach(data.teams, (team, id) => {
    if (!team) {
      console.error('Invalid team', id)
      delete data.teams[id]
      return
    }
    if (!team.id) {
      console.error('Invalid team id. Dropping team.', team)
      delete data.teams[id]
    }
    if (!team.name || !team.name.trim()) {
      console.error('Invalid team name. Setting a default.', team)
      team.name = 'Missing Team Name'
    }
  })
}

const validateGames = (data: Data): void => {
  _.forEach(data.games, (game, id) => {
    if (!game) {
      console.error('Invalid game', id)
      delete data.games[id]
      return
    }
    if (!game.id) {
      console.error('Invalid game id. Dropping game.', game)
      delete data.games[id]
    }
    if (!game.name || !game.name.trim()) {
      console.error('Invalid game name. Setting a default.', game)
      game.name = 'Missing Game Name'
    }
  })
}

const validatePlayers = (data: Data): void => {
  _.forEach(data.players, (player, id) => {
    if (!player) {
      console.error('Invalid player', id)
      delete data.players[id]
      return
    }
    if (!player.id) {
      console.error('Invalid player id. Dropping player.', player)
      delete data.players[id]
    }
    if (!player.name || !player.name.trim()) {
      console.error('Invalid player name. Setting a default.', player)
      player.name = 'Missing Player Name'
    }
    if (player.teamId && !data.teams[player.teamId]) {
      console.error('Invalid team set on player. Dropping player.', player)
      delete data.players[id]
    }
  })
}

const validateScores = (data: Data): void => {
  _.forEach(data.scores, (score, id) => {
    if (!score) {
      console.error('Invalid score', id)
      delete data.scores[id]
      return
    }
    if (!score.id) {
      console.error('Invalid score id', score)
      delete data.scores[id]
    }
    if (!score.date || !score.date.match('^\\d{4}-\\d{2}-\\d{2}$')) {
      console.error('Invalid score date. Dropping score.', score)
      delete data.scores[id]
    }
    if (!_.isNumber(score.score1)) {
      console.error('Invalid score score1. Dropping score.', score)
      delete data.scores[id]
    }
    if (!_.isNumber(score.score2)) {
      console.error('Invalid score score2. Dropping score.', score)
      delete data.scores[id]
    }
    if (!data.games[score.gameId]) {
      console.error('Invalid score gameId. Dropping score.', score)
      delete data.scores[id]
    }
    if (!data.players[score.playerId1]) {
      console.error('Invalid score playerId1. Dropping score.', score)
      delete data.scores[id]
    }
    if (!data.players[score.playerId2]) {
      console.error('Invalid score playerId2. Dropping score.', score)
      delete data.scores[id]
    }
  })
}

const validateData = (data: Data): Data => {
  validateTeams(data)
  validateGames(data)
  validatePlayers(data)
  validateScores(data)
  return data
}

export const getData = (config: AppConfig): Promise<Data> => {
  const backendType = config.backend.type
  let promise
  if (backendType === 'google-sheets-published') {
    promise = GoogleSheetsPublished.getData(config)
  } else if (backendType === 'rest-api') {
    promise = RestApi.getData(config)
  } else if (backendType === 'random') {
    promise = Random.getData(config)
  } else {
    throw new Error(`Unsupported backend type: ${backendType}`)
  }

  return promise
    .then((data: Data) => validateData(data))
    .then((data: Data) => generateColorsForPlayers(data))
}

export class AddEntry extends React.Component<{config: AppConfig, data: Data}, {}> {
  render() {
    const {config, data} = this.props
    if (!config || !data) {
      return null
    }

    const backendType = config.backend.type
    if (backendType === 'google-sheets-published') {
      return <GoogleSheetsPublished.AddEntry config={config} />
    } else if (backendType === 'rest-api') {
      return [
        <RestApi.AddScore config={config} data={data} />,
        <RestApi.AddPlayer config={config} data={data}  />,
        <RestApi.SeeData config={config} />,
      ]
    } else if (backendType === 'random') {
      return []
    } else {
      throw new Error(`Unsupported backend type: ${backendType}`)
    }
  }
}
