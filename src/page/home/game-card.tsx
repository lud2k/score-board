
import * as React from 'react'
import {Data} from '../../model/data'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import EventIcon from 'material-ui-icons/Event'
import BubbleChartIcon from 'material-ui-icons/BubbleChart'
import {AppConfig} from '../../config'
import {Game} from '../../model/models'

export class GameCard extends React.Component<{ data: Data, game: Game }, {}> {
  render() {
    const {game, data} = this.props
    return (
      <div>
        <Grid item xs={12}>
          <Paper>
            <Typography type='title' color='inherit' style={{ padding: '20px' }}>
              <EventIcon /> {game.name}
            </Typography>
          </Paper>
        </Grid>
      </div>
    )
  }
}
