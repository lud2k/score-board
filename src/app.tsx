
import * as React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import {CircularProgress} from 'material-ui/Progress'
import {AppConfig, getConfig} from './config'
import {getData} from './backend/backend'
import {Content} from './view/content'
import * as _ from 'lodash'
import {HashRouter, Route, Redirect} from 'react-router-dom'
import {Data} from './model/data'
import {AppBarActions} from './view/app-bar-actions'

const styles = require('./app.css')

export class RedirectToRandomGame extends React.Component<{ data: Data }, {}> {
  render() {
    const gameId = _.values(this.props.data.games)[0].id
    return <Redirect to={`/game/${gameId}`} />
  }
}

export class Routes extends React.Component<{ data: Data }, {}> {
  render() {
    const {data} = this.props
    return (
      <div className='routes'>
        <Route path='/' exact render={({ match }) => {
          return <RedirectToRandomGame data={data} />
        }} />
        <Route path='/game/:gameId' render={({ match }) => {
          const game = data.getGameById(match.params.gameId)
          if (game) {
            return <Content data={data} gameId={game.id} />
          } else {
            return <RedirectToRandomGame data={data} />
          }
        }} />
      </div>
    )
  }
}

export class Root extends React.Component<{ data: Data, config: AppConfig }, {}> {
  render() {
    const {data, config} = this.props
    return (
      <div className='root'>
        <AppBar position='static'>
          <Toolbar>
            <Typography type='title' color='inherit' style={{ flex: 1 }}>
              Score Board
            </Typography>
            <Route path='/game/:gameId' render={({ match }) => {
              return <AppBarActions data={data} gameId={match.params.gameId} config={config} />
            }} />
          </Toolbar>
        </AppBar>
        <Routes data={data} />
      </div>
    )
  }
}

export class App extends React.Component<{}, { data?: Data, error?: any, config?: AppConfig }> {

  constructor(props: any) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    getConfig()
      .then((config: AppConfig) => {
        return getData(config)
          .then((data: Data) => {
            this.setState({data, config})
          })
      })
      .catch((error) => {
        this.setState({ error })
        throw error
      })
  }

  renderContent() {
    const {data, error} = this.state
    if (error) {
      return (
        <div className='error'>
          <p>
            Ooops, something went wrong.<br />Try refreshing this page.
          </p>
        </div>
      )
    }

    if (!data) {
      return (
        <div className='loading'>
          <CircularProgress size={50} />
          <p>
            Fetching scores...
          </p>
        </div>
      )
    }

    return <Root data={data} config={this.state.config} />
  }

  render() {
    return (
      <HashRouter basename='/'>
        <div className={styles.app}>
          {this.renderContent()}
        </div>
      </HashRouter>
    )
  }
}
