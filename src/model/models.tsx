
export type Id = string

export interface Game {
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
  name: string
  color: string
  avatar?: string
}

export interface PlayersMap {[id: string]: Player}
export interface GamesMap {[id: string]: Game}
export interface ScoresMap {[id: string]: Score}

export interface PlayerRanking {
  date: string
  rating: number
  deviation: number
  volatility: number
  playerId: Id
  rank: number
  normalizedRating: number
}

export interface PlayerRankingsByDate {[date: string]: PlayerRanking[]}

export interface Stats {
  rankingsByDate: PlayerRankingsByDate
  rankings: PlayerRanking[]
}
