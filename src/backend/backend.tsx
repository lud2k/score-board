
import * as React from 'react'
import {AppConfig} from '../config'
import * as GoogleSheetsPublished from './google-sheets-published'
import {Data} from '../model/data'

export const getData = (config: AppConfig): Promise<Data> => {
  const backendType = config.backend.type
  if (backendType === 'google-sheets-published') {
    return GoogleSheetsPublished.getData(config)
  }
  throw new Error(`Unsupported backend type: ${backendType}`)
}

export class AddEntry extends React.Component<{config: AppConfig, data: Data}, {}> {
  render() {
    const {config, data} = this.props
    if (!config || !data) {
      return null
    }

    const backendType = config.backend.type
    if (backendType === 'google-sheets-published') {
      return <GoogleSheetsPublished.AddEntry config={config}/>
    }
    throw new Error(`Unsupported backend type: ${backendType}`)
  }
}
