
import * as React from 'react'
import {Id} from '../model/models'
import {Data} from '../model/data'
import {AppConfig} from '../config'
import {GameMenu} from './game-menu'
import {AddEntry} from '../backend/backend'

const {appBarActions} = require('./app-bar-actions.css')

export class AppBarActions extends React.Component<{ data: Data, gameId: Id, config: AppConfig }, {}> {
  onChangeGame = (gameId: Id) => {
    location.hash = `#/game/${gameId}`
  }

  render() {
    const {data, config, gameId} = this.props
    return (
      <div className={appBarActions}>
        <GameMenu
          games={data.games}
          selected={gameId}
          onChange={this.onChangeGame} />
        <AddEntry config={config} data={data} />
      </div>
    )
  }
}
