
import * as React from 'react'
import {AppConfig} from './config'
import {Route} from 'react-router-dom'
import {NotFound} from './page/notfound/not-found'
import {Player} from './page/player/player'
import {Switch} from 'react-router'
import {Game} from './page/game/game'
import {Data, Stats} from './model/models'
import {Home} from './page/home/home'
import {Team} from './page/team/team'

export class Routes extends React.Component<{ data: Data, stats: Stats, config: AppConfig }, {}> {
  render() {
    const {data, stats, config} = this.props
    return (
      <div>
        <Switch>
          <Route path='/' exact render={({ match }) => {
            return <Home data={data} stats={stats} config={config} />
          }} />
          <Route path='/game/:gameId' render={({ match }) => {
            const game = data.games[match.params.gameId]
            if (game) {
              return <Game data={data} stats={stats} config={config} gameId={game.id} />
            } else {
              return <NotFound data={data} config={config} />
            }
          }} />
          <Route path='/team/:teamId' render={({ match }) => {
            const team = data.teams[match.params.teamId]
            if (team) {
              return <Team data={data} config={config} stats={stats} teamId={team.id} />
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
