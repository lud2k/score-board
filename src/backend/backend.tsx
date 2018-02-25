
import * as React from 'react'
import {AppConfig} from '../config'
import * as GoogleSheetsPublished from './google-sheets-published'
import * as RestApi from './rest-api'
import {Data, Player} from '../model/models'
import * as randomColor from "randomcolor"
import _ = require('lodash')

export const getData = (config: AppConfig): Promise<Data> => {
  const backendType = config.backend.type
  let promise
  if (backendType === 'google-sheets-published') {
    promise = GoogleSheetsPublished.getData(config)
  } else if (backendType === 'rest-api') {
    promise = RestApi.getData(config)
  } else {
    throw new Error(`Unsupported backend type: ${backendType}`)
  }

  return promise.then(data => {
    // generate random colors for players
    const colors = randomColor({
      luminosity: 'dark',
      count: _.size(data.players),
      seed: 15158731,
    })
    let index = 0
    _.forEach(data.players, (player: Player) => {
      if (!player.color) {
        player.color = colors[index++]
      }
    })

    return data
  })
}

export class AddEntry extends React.Component<{config: AppConfig, data: Data}, {}> {
  render() {
    const {config, data} = this.props
    if (!config || !data) {
      return null
    }

    const backendType = config.backend.type
    if (backendType === 'google-sheets-published') {
      return <GoogleSheetsPublished.AddEntry config={config} />
    } else if (backendType === 'rest-api') {
      return [
        <RestApi.AddScore config={config} data={data} />,
        <RestApi.AddPlayer config={config} data={data}  />,
        <RestApi.SeeData config={config} />,
      ]
    } else {
      throw new Error(`Unsupported backend type: ${backendType}`)
    }
  }
}
