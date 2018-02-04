
import * as React from 'react'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Grid from 'material-ui/Grid'
import BubbleChartIcon from 'material-ui-icons/BubbleChart'
import {Id} from '../../model/models'
import {Data} from '../../model/data'
import {Graph} from './graph'
import {MenuIconPopover} from '../common/menu-icon-popover'
import {AppConfig} from '../../config'
import {Title} from '../common/title'
import {ScoreStats} from './score-stats'

const styles = require('./player.css')

export class Player extends React.Component<{ data: Data, config: AppConfig, playerId: Id }, {}> {
  render() {
    const {data, config, playerId} = this.props
    return (
      <div>
        <AppBar position='static'>
          <Toolbar>
            <MenuIconPopover data={data} />
            <Title config={config} section='Player' subSection={data.players[playerId].name} />
          </Toolbar>
        </AppBar>
        <div className={styles.content}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={6}>
              <Paper>
                <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                  <BubbleChartIcon className={styles.titleIcon} /> Graph
                </Typography>
                <Graph data={this.props.data} playerId={this.props.playerId} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper>
                <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                  <BubbleChartIcon className={styles.titleIcon} /> Won Games
                </Typography>
                <ScoreStats data={this.props.data} playerId={this.props.playerId} />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}
