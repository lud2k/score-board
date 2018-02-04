
import {AppConfig} from '../../config'
import {Game, GamesMap, ScoresMap, PlayersMap} from '../../model/models'
import * as PapaParse from 'papaparse'
import * as _ from 'lodash'
import {Data} from '../../model/data'
import * as randomColor from 'randomcolor'

const PUBLIC_SHEET_URL = (id: string) =>
  `https://docs.google.com/spreadsheets/d/e/${id}/pub?gid=0&single=true&output=csv`

let CACHE: Promise<Data> = null

interface CsvRow {
  'Date': string
  'Game': string
  'Name 1': string
  'Name 2': string
  'Score 1': string
  'Score 2': string
}

const parsePlayers = (rows: CsvRow[]): PlayersMap => {
  const namesMap = {}
  rows.forEach((row) => {
    namesMap[row['Name 1']] = true
    namesMap[row['Name 2']] = true
  })

  const colors = randomColor({
    luminosity: 'dark',
    count: _.keys(namesMap).length,
    seed: 15158731,
  })

  const players = _.keys(namesMap).map((name, index) => ({
    color: colors[index],
    id: index.toString(),
    name,
  }))
  return _.keyBy(players, 'id')
}

const parseGames = (rows: CsvRow[]): GamesMap => {
  const namesMap = {}
  rows.forEach((row) => {
    namesMap[row['Game']] = true
  })
  const games = _.keys(namesMap).map((name, index) => ({ id: index.toString(), name }))
  return _.keyBy(games, 'id')
}

const parseScores = (games: GamesMap, players: PlayersMap, rows: CsvRow[]): ScoresMap => {
  const gamesByName = _.keyBy(_.values(games), 'name')
  const playersByName = _.keyBy(_.values(players), 'name')

  const scores = rows.map((row, index) => ({
    id: index.toString(),
    date: row['Date'],
    gameId: gamesByName[row['Game']].id,
    playerId1: playersByName[row['Name 1']].id,
    playerId2: playersByName[row['Name 2']].id,
    score1: parseInt(row['Score 1'], 10),
    score2: parseInt(row['Score 2'], 10),
  }))
  return _.keyBy(scores, 'id')
}

export const getData = (config: AppConfig): Promise<Data> => {
  if (CACHE) {
    return CACHE
  } else {
    return CACHE = fetch(PUBLIC_SHEET_URL(config.backend.publishedId))
      .then((response) => {
        return response.text().then((csvText) => {
          const data = PapaParse.parse(csvText, {header: true}).data
          const players = parsePlayers(data)
          const games = parseGames(data)
          const scores = parseScores(games, players, data)
          return new Data(players, games, scores)
        })
      })
  }
}
