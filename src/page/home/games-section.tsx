
import * as React from 'react'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import ToysIcon from 'material-ui-icons/Toys'
import {Data, Game, Score} from '../../model/models'
import {AppConfig} from '../../config'
import List, { ListItem, ListItemText } from 'material-ui/List'
import * as _ from 'lodash'

const styles = require('./games-section.css')

export class GamesSection extends React.Component<{ data: Data, config: AppConfig }, {}> {
  onClickGame(game: Game) {
    location.hash = `#/game/${game.id}`
  }

  renderDataStats(game: Game) {
    const { data } = this.props
    const scores = _.filter(data.scores, {gameId: game.id})
    const players = scores.reduce((res: any, score: Score) => {
      res[score.playerId1] = res[score.playerId2] = true
      return res
    }, {})
    return (
      <div>
        {_.size(players)} players have recorded {scores.length} scores.
      </div>
    )
  }

  renderGames() {
    const { data } = this.props
    const games = _.values(data.games)
    return games.map((game) => {
      const nbPlayers = 10
      const nbGames = 10
      return (
        <ListItem button onClick={(event) => this.onClickGame(game)}>
          <ListItemText primary={game.name} secondary={[
            this.renderDataStats(game),
          ]} />
        </ListItem>
      )
    })
  }

  render() {
    const { teams } = this.props.data
    const willShowTeamsSection = _.size(teams) >= 2
    return (
      <Grid item xs={12} sm={willShowTeamsSection ? 6 : 12}>
        <Paper className={styles.paper}>
          <Typography type='title' color='inherit' style={{ padding: '20px' }}>
            <ToysIcon className={styles.titleIcon} /> Games
          </Typography>
          <List component="nav">
            {this.renderGames()}
          </List>
        </Paper>
      </Grid>
    )
  }
}
