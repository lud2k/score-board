
import * as _ from 'lodash'

export type BackendType = 'google-sheets-published'

declare global {
  interface Window {
    config?: AppConfig
  }
}

export interface GoogleSheetsPublishedConfig {
  publishedId: string
  sheetId: string
}

export interface GoogleSheetsApiConfig {
  apiKey: string
}

export type BackendConfig = {
  type: BackendType,
} & GoogleSheetsPublishedConfig & GoogleSheetsApiConfig

export interface AppConfig {
  backend: BackendConfig
}

const loadConfig = (configUrl?: string): Promise<AppConfig> => {
  return fetch(configUrl || 'config.json')
    .then((response) => {
      return response.json()
    })
}

export const getConfig = (): Promise<AppConfig> => {
  // Try to get the config from the window object
  if (window.config) {
    return Promise.resolve(window.config)
  }

  // Try to get the config JSON from query params
  const queryParams = new URLSearchParams(location.search)
  if (queryParams.get('config')) {
    return Promise.resolve(JSON.parse(queryParams.get('config')))
  }

  // Try to get the config from query params
  const configParams = Array.from(queryParams.keys())
    .filter((key: string) => key.startsWith('config.'))
  if (configParams.length > 0) {
    const config = configParams.reduce((ret: any, key: string): any => {
      return _.set(ret, key.substr(7), queryParams.get(key))
    }, {})
    return Promise.resolve(config)
  }

  // Try to get the config using AJAX
  return loadConfig(queryParams.get('configUrl'))
}
