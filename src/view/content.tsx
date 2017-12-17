
import * as React from 'react'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import {PlayerGraph} from './player-graph'
import {Ranking} from './ranking'
import {Id} from '../model/models'
import {RankingsOverTime} from './rankings-over-time'
import {Data} from '../model/data'
import {Calendar} from './calendar'
import {Facts} from './facts'
import EventIcon from 'material-ui-icons/Event'
import BubbleChartIcon from 'material-ui-icons/BubbleChart'
import MultilineChartIcon from 'material-ui-icons/MultilineChart'
import NewReleasesIcon from 'material-ui-icons/NewReleases'

const styles = require('./content.css')

export class Content extends React.Component<{ data: Data, gameId: Id }, {}> {
  render() {
    const data = this.props.data.filterForGame(this.props.gameId)
    const stats = data.getStats()
    return (
      <div className='content'>
        <Grid container spacing={24}>
          <Facts data={data} stats={stats} />
          <Grid item xs={12}>
            <Paper>
              <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                <EventIcon className={styles.titleIcon} /> Activity
              </Typography>
              <Calendar data={data} stats={stats} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper>
              <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                <BubbleChartIcon className={styles.titleIcon} /> Graph
              </Typography>
              <PlayerGraph data={data} stats={stats} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper>
              <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                <NewReleasesIcon className={styles.titleIcon} /> Rankings
              </Typography>
              <Ranking data={data} stats={stats} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                <MultilineChartIcon className={styles.titleIcon} /> Ranking over time
              </Typography>
              <RankingsOverTime data={data} stats={stats} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}
