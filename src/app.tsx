
import * as React from 'react'
import {CircularProgress} from 'material-ui/Progress'
import {AppConfig, getConfig} from './config'
import {getData} from './backend/backend'
import {HashRouter} from 'react-router-dom'
import {Routes} from './routes'
import {store} from './redux/store'
import {setConfig, setData} from './redux/actions'
import {Data, Stats} from './model/models'

const styles = require('./app.css')

export class App extends React.Component<{}, { data?: Data, stats?: Stats, error?: any,
  config?: AppConfig }> {

  constructor(props: any) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    getConfig()
      .then((config: AppConfig) => {
        store.dispatch(setConfig(config))
        return getData(config)
          .then((data: Data) => {
            store.dispatch(setData(data))
          })
      })
      .catch((error) => {
        this.setState({ error })
        throw error
      })

    // Update the state when the store is changed
    store.subscribe(() => {
      const state = store.getState()
      this.setState({ data: state.data, stats: state.stats, config: state.config })
    })
  }

  renderContent() {
    const {data, stats, config, error} = this.state
    if (error) {
      return (
        <div className='error'>
          <p>
            Ooops, something went wrong.<br />Try refreshing this page.
          </p>
        </div>
      )
    }

    if (!config) {
      return (
        <div className='loading'>
          <CircularProgress size={50} />
          <p>
            Fetching config...
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

    return (
        <div className='root'>
          <Routes data={data} stats={stats} config={config} />
        </div>
      )
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
