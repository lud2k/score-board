
export type Id = string

export interface Data {
  players: PlayersMap
  scores: ScoresMap
  games: GamesMap
  teams: TeamMap
}

export interface Game {
  id: Id
  name: string
}

export interface Team {
  id: Id
  name: string
}

export interface Score {
  id: Id
  date: string
  gameId: string
  playerId1: string
  playerId2: string
  score1: number
  score2: number
}

export interface Player {
  id: Id
  teamId: Id
  name: string
  color: string
  avatar?: string
}

export interface PlayersMap {[id: string]: Player}
export interface GamesMap {[id: string]: Game}
export interface ScoresMap {[id: string]: Score}
export interface TeamMap {[id: string]: Team}

export interface PlayerRanking {
  date: string
  rating: number
  deviation: number
  volatility: number
  playerId: Id
  rank: number
  normalizedRating: number
}

export interface TeamRanking {
  rating: number
  deviation: number
  volatility: number
  teamId: Id
}

export interface PlayerRankingsByDate {[date: string]: PlayerRanking[]}

export interface GameStats {
  rankingsByDate: PlayerRankingsByDate
  rankings: PlayerRanking[]
}
export interface GamesStats {
  [id: string]: GameStats
}

export interface Stats {
  games: GamesStats
}
