
import {Data, Stats} from '../model/models'
import {computeRankings} from './ranking'

export const computeStats = (data: Data): Stats => {
  return {
    ...computeRankings(data),
  }
}
