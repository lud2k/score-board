
import * as React from 'react'
import {CircularProgress} from 'material-ui/Progress'
import {AppConfig, getConfig} from './config'
import {getData} from './backend/backend'
import {HashRouter} from 'react-router-dom'
import {Data} from './model/data'
import {Routes} from './routes'

const styles = require('./app.css')

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

    return (
        <div className='root'>
          <Routes data={data} config={this.state.config} />
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
