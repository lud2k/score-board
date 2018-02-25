
import * as React from 'react'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Grid from 'material-ui/Grid'
import {PlayerGraph} from './player-graph'
import {Ranking} from './ranking'
import {Data, Id} from '../../model/models'
import {RankingsOverTime} from './rankings-over-time'
import {Calendar} from './calendar'
import {Facts} from './facts'
import EventIcon from 'material-ui-icons/Event'
import BubbleChartIcon from 'material-ui-icons/BubbleChart'
import MultilineChartIcon from 'material-ui-icons/MultilineChart'
import NewReleasesIcon from 'material-ui-icons/NewReleases'
import {AppBarActions} from './app-bar-actions'
import {AppConfig} from '../../config'
import {MenuIconPopover} from '../common/menu-icon-popover'
import {Title} from '../common/title'
import {filterByGameId} from '../../core/filter-data'
import {computeStats} from '../../core/stats'

const styles = require('./game.css')

export class Game extends React.Component<{ data: Data, config: AppConfig, gameId: Id }, {}> {
  render() {
    const {data, gameId, config} = this.props
    const gameData = filterByGameId(gameId, data)
    const gameStats = computeStats(gameData)
    return (
      <div>
        <AppBar position='static'>
          <Toolbar>
            <MenuIconPopover data={data} />
            <Title config={config} section='Game' subSection={data.games[gameId].name} />
            <AppBarActions data={data} config={config} />
          </Toolbar>
        </AppBar>
        <div className={styles.content}>
          <Grid container spacing={24}>
            <Facts data={gameData} stats={gameStats} />
            <Grid item xs={12}>
              <Paper>
                <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                  <EventIcon className={styles.titleIcon} /> Activity
                </Typography>
                <Calendar data={gameData} stats={gameStats} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper>
                <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                  <BubbleChartIcon className={styles.titleIcon} /> Graph
                </Typography>
                <PlayerGraph data={gameData} stats={gameStats} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper>
                <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                  <NewReleasesIcon className={styles.titleIcon} /> Rankings
                </Typography>
                <Ranking data={gameData} stats={gameStats} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                  <MultilineChartIcon className={styles.titleIcon} /> Ranking over time
                </Typography>
                <RankingsOverTime data={gameData} stats={gameStats} />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}
