
import {Stats} from '../model/models'
import {computeRankings} from './ranking'
import {Data} from '../model/data'

export const computeStats = (data: Data): Stats => {
  return {
    ...computeRankings(data),
  }
}
