
import * as React from 'react'
import {AppConfig} from '../../config'
import {AddEntry} from '../../backend/backend'
import {Data} from '../../model/models'

const {appBarActions} = require('./app-bar-actions.css')

export class AppBarActions extends React.Component<{ data: Data, config: AppConfig }, {}> {
  render() {
    const {data, config} = this.props
    return (
      <div className={appBarActions}>
        <AddEntry config={config} data={data} />
      </div>
    )
  }
}
