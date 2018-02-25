
import {AppConfig} from '../../config'
import * as _ from 'lodash'
import {Data} from '../../model/models'

let CACHE: Promise<Data> = null

export const getData = (config: AppConfig): Promise<Data> => {
  if (CACHE) {
    return CACHE
  } else {
    return CACHE = fetch(`${config.backend.url}/data`)
      .then((response: any) => {
        return response.json().then((data: any) => {
          return {
            players: _.keyBy(data.players, 'id'),
            games: _.keyBy(data.games, 'id'),
            scores: _.keyBy(data.scores, 'id'),
          }
        })
      })
  }
}
