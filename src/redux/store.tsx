import {
  ADD_PLAYER, ADD_SCORE, AddPlayerAction, AddScoreAction, SET_CONFIG,
  SET_DATA, SetConfigAction, SetDataAction
} from './actions'
import {createStore, Store} from 'redux'
import {AppConfig} from '../config'
import {Data} from '../model/models'

export interface StoreState {
  data?: Data
  config?: AppConfig
}

export const reducer = (state: StoreState = {}, action: AddPlayerAction & AddScoreAction &
  SetConfigAction & SetDataAction): StoreState => {

  switch (action.type) {
    case SET_CONFIG: {
      return {
        ...state,
        config: action.config
      }
    }
    case SET_DATA: {
      return {
        ...state,
        data: action.data
      }
    }
    case ADD_PLAYER: {
      return {
        ...state,
        data: {
          ...state.data,
          players: {
            ...state.data.players,
            [action.player.id]: action.player,
          }
        }
      }
    }
    case ADD_SCORE: {
      return {
        ...state,
        data: {
          ...state.data,
          scores: {
            ...state.data.scores,
            [action.score.id]: action.score,
          }
        }
      }
    }
    default:
      return state
  }
}

export const store: Store<StoreState> = createStore(reducer)
