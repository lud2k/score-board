import {
  ADD_PLAYER, ADD_SCORE, AddPlayerAction, AddScoreAction, SET_CONFIG,
  SET_DATA, SetConfigAction, SetDataAction,
} from './actions'
import {createStore, Store} from 'redux'
import {AppConfig} from '../config'
import {Data, Stats} from '../model/models'
import {computeStats} from '../core/stats'

export interface StoreState {
  data?: Data
  stats?: Stats
  config?: AppConfig
}

export const reducer = (state: StoreState = {}, action: AddPlayerAction & AddScoreAction &
  SetConfigAction & SetDataAction): StoreState => {

  switch (action.type) {
    case SET_CONFIG: {
      return {
        ...state,
        config: action.config,
      }
    }
    case SET_DATA: {
      return {
        ...state,
        data: action.data,
        stats: computeStats(action.data),
      }
    }
    case ADD_PLAYER: {
      const data = {
        ...state.data,
        players: {
          ...state.data.players,
          [action.player.id]: action.player,
        },
      }
      return {
        ...state,
        data,
        stats: computeStats(data),
      }
    }
    case ADD_SCORE: {
      const data = {
        ...state.data,
        scores: {
          ...state.data.scores,
          [action.score.id]: action.score,
        },
      }
      return {
        ...state,
        data,
        stats: computeStats(data),
      }
    }
    default:
      return state
  }
}

export const store: Store<StoreState> = createStore(reducer)
