
import * as React from 'react'
import {Data} from '../../model/data'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import EventIcon from 'material-ui-icons/Event'
import BubbleChartIcon from 'material-ui-icons/BubbleChart'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import {AppConfig} from '../../config'
import {GameCard} from './game-card'
import _ = require('lodash')
import {MenuIconPopover} from '../common/menu-icon-popover'

const styles = require('./home.css')

export class Home extends React.Component<{ data: Data, config: AppConfig }, {}> {
  renderContent() {
    const {data} = this.props
    const games = _.values(data.games)
    return (
      <Grid container spacing={24}>
        {games.map((game, index) => <GameCard key={index} game={game} data={data} />)}
      </Grid>
    )
  }

  render() {
    const {config, data} = this.props
    return (
      <div className={styles.home}>
        <AppBar position='static'>
          <Toolbar>
            <MenuIconPopover data={data}/>
            <Typography type='title' color='inherit'>
              {config.title || 'Score Board'}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className='content'>
          {this.renderContent()}
        </div>
      </div>
    )
  }
}
