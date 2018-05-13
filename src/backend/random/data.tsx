
import {AppConfig} from '../../config'
import {Game, Data, Player, Score, Team} from '../../model/models'
import * as _ from 'lodash'
import moment = require('moment')

let CACHE: Promise<Data> = null
const SCORES_PER_DAY = 6
const PLAYERS = ['Cordie', 'Priscilla', 'Myrna', 'Margarette', 'Delmar', 'Liliana', 'Philip',
  'Regine', 'Oma', 'Ashlee', 'Janette', 'Alvaro', 'Benito', 'Jenette', 'Flora', 'Scotty', 'Else',
  'Bryant', 'Treasa', 'Jacquiline']
const GAMES =  ['Ping Pong', 'Billiard', 'Fuzzball', 'Cornhole']
const TEAMS = ['Tango', 'Alpha', 'Delta']

const generateRandomScores = (games: Game[], players: Player[]): Score[] => {
  // assign players to games
  const gamesPlayers = {}
  const halfPlayersCount = Math.round(PLAYERS.length/2)
  games.forEach((game) => {
    gamesPlayers[game.id] = _.sampleSize(players, _.random(halfPlayersCount-halfPlayersCount/3,
      halfPlayersCount+halfPlayersCount/3))
  })

  // give players friends
  const playersFriends = {}
  games.forEach((game) => {
    playersFriends[game.id] = {}
    const playersInGame = gamesPlayers[game.id]
    const half = Math.round(playersInGame.length/2)
    players.forEach((player) => {
      playersFriends[game.id][player.id] =
        _.filter(_.sampleSize(playersInGame, _.random(2, half)),
          (playerInGame) => playerInGame.id !== player.id)
    })
  })

  // for each day of the last 5 months
  const ret = []
  let date = moment()
  for (let i=0; i<30*5; i++) {
    date = date.clone().subtract(1, 'day')
    const dateStr = date.format('YYYY-MM-DD')

    // generate SCORES_PER_DAY scores
    for (let j=0; j<SCORES_PER_DAY; j++) {
      const randomGame = _.sample(games)
      const randomPlayer1 = _.sample(gamesPlayers[randomGame.id])
      const randomPlayer2 = _.sample(playersFriends[randomGame.id][randomPlayer1.id])
      const score1 = _.random(5)
      const score2 = score1 + _.random(1,5)

      ret.push({
        id: `${i}_${j}`,
        date: dateStr,
        gameId: randomGame.id,
        playerId1: randomPlayer1.id,
        playerId2: randomPlayer2.id,
        score1,
        score2,
      } as Score)
    }
  }
  return ret
}

const generateRandomData = (): Promise<Data> => {
  const games = GAMES.map((name: string, index: number): Game => ({
    id: index.toString(),
    name
  }))

  const teams = TEAMS.map((name: string, index: number): Team => ({
    id: index.toString(),
    name
  }))

  const players = PLAYERS.map((name: string, index: number): Player => ({
    id: index.toString(),
    teamId: teams[index%teams.length].id,
    name,
    color: null
  }))

  const scores = generateRandomScores(games, players)

  return Promise.resolve({
    players: _.keyBy(players, 'id'),
    games: _.keyBy(games, 'id'),
    scores: _.keyBy(scores, 'id'),
    teams: _.keyBy(teams, 'id')
  })
}

export const getData = (config: AppConfig): Promise<Data> => {
  if (CACHE) {
    return CACHE
  } else {
    return CACHE = generateRandomData()
  }
}
