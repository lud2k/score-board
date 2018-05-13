
import {Data, Stats} from '../model/models'
import {computeGameRankings} from './ranking'

export const computeStats = (data: Data): Stats => {
  return {
    games: computeGameRankings(data)
  }
}
