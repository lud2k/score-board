
import * as React from 'react'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import EventIcon from 'material-ui-icons/Event'
import {Data, Game} from '../../model/models'

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
