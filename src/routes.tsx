
import * as React from 'react'
import {AppConfig} from './config'
import * as _ from 'lodash'
import {Route, Redirect} from 'react-router-dom'
import {NotFound} from './page/notfound/not-found'
import {Player} from './page/player/player'
import {Switch} from 'react-router'
import {Game} from './page/game/game'
import {Data} from './model/models'

export class Routes extends React.Component<{ data: Data, config: AppConfig }, {}> {
  render() {
    const {data, config} = this.props
    return (
      <div>
        <Switch>
          <Route path='/' exact render={({ match }) => {
            const gameId = _.values(this.props.data.games)[0].id
            return <Redirect to={`/game/${gameId}`} />
          }} />
          <Route path='/game/:gameId' render={({ match }) => {
            const game = data.games[match.params.gameId]
            if (game) {
              return <Game data={data} config={config} gameId={game.id} />
            } else {
              return <NotFound data={data} config={config} />
            }
          }} />
          <Route path='/player/:playerId' render={({ match }) => {
            const player = data.players[match.params.playerId]
            if (player) {
              return <Player data={data} playerId={player.id} config={config} />
            } else {
              return <NotFound data={data} config={config} />
            }
          }} />
          <Route render={({ match }) => <NotFound data={data} config={config} />} />
        </Switch>
      </div>
    )
  }
}
