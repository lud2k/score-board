
import {AppConfig} from '../../config'
import {Game, GamesMap, ScoresMap, PlayersMap, Data, TeamMap, Team} from '../../model/models'
import * as PapaParse from 'papaparse'
import * as _ from 'lodash'

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

const parsePlayers = (teams: TeamMap, rows: CsvRow[]): PlayersMap => {
  const teamsByName = _.keyBy(_.values(teams), 'name')
  const namesTeamMap = {}
  rows.forEach((row) => {
    if (row['Team Player'] && row['Team Name']) {
      namesTeamMap[row['Team Player']] = teamsByName[row['Team Name']]
    }
  })

  const namesMap = {}
  rows.forEach((row) => {
    namesMap[row['Name 1']] = true
    namesMap[row['Name 2']] = true

    // HACK: modifies the input, not great, creates a new "default" team.
    if (!namesTeamMap[row['Name 1']] || !namesTeamMap[row['Name 2']]) {
      teams['default'] = {
        id: 'default',
        name: 'Unknown Team'
      }
    }
  })

  const players = _.keys(namesMap).map((name, index) => ({
    color: null,
    teamId: namesTeamMap[name] ? namesTeamMap[name].id : 'default',
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

const parseTeams = (rows: CsvRow[]): TeamMap => {
  const teams: Set<string> = new Set()
  rows.forEach((row) => {
    if (row['Team Name'] && row['Team Player']) {
      teams.add(row['Team Name'])
    }
  })
  return _.keyBy(Array.from(teams).map((name, id) => ({id: id.toString(), name})), 'id')
}

export const getData = (config: AppConfig): Promise<Data> => {
  if (CACHE) {
    return CACHE
  } else {
    return CACHE = fetch(PUBLIC_SHEET_URL(config.backend.publishedId))
      .then((response) => {
        return response.text().then((csvText) => {
          const data = PapaParse.parse(csvText, {header: true}).data
          const teams = parseTeams(data)
          const players = parsePlayers(teams, data)
          const games = parseGames(data)
          const scores = parseScores(games, players, data)
          return {players, games, scores, teams}
        })
      })
  }
}
