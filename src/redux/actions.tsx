import {Action} from 'redux'
import {Data, Player, Score} from '../model/models'
import {AppConfig} from '../config'

export const ADD_PLAYER = 'ADD_PLAYER'
export const ADD_SCORE = 'ADD_SCORE'
export const SET_DATA = 'SET_DATA'
export const SET_CONFIG = 'SET_CONFIG'

export interface AddScoreAction extends Action {
  score: Score
}

export interface AddPlayerAction extends Action {
  player: Player
}

export interface SetDataAction extends Action {
  data: Data
}

export interface SetConfigAction extends Action {
  config: AppConfig
}

export const addPlayer = (player: Player): AddPlayerAction => ({
  type: ADD_PLAYER,
  player
})

export const addScore = (score: Score): AddScoreAction => ({
  type: ADD_SCORE,
  score
})

export const setData = (data: Data): SetDataAction => ({
  type: SET_DATA,
  data
})

export const setConfig = (config: AppConfig): SetConfigAction => ({
  type: SET_CONFIG,
  config
})

