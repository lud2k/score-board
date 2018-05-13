
import * as React from 'react'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import PagesIcon from 'material-ui-icons/Pages'
import {Data, Game, Team} from '../../model/models'
import List, { ListItem, ListItemIcon, ListItemText, ListSubheader } from 'material-ui/List'
import {AppConfig} from '../../config'
import {Link} from 'react-router-dom'
import * as _ from 'lodash'

const styles = require('./teams-section.css')

export class TeamsSection extends React.Component<{ data: Data, config: AppConfig }, {}> {
  onClickTeam(team: Team) {
    location.hash = `#/team/${team.id}`
  }

  renderNumberOfPlayers(team: Team) {
    const { data } = this.props
    const nbPlayers = _.filter(data.players, {teamId: team.id}).length
    return (
      <div>
        There are {nbPlayers} players in this team.
      </div>
    )
  }

  renderTeams() {
    const { data } = this.props
    const teams = _.values(data.teams)
    return teams.map((team, index) => {
      return (
        <ListItem button onClick={(event) => this.onClickTeam(team)}>
          <ListItemText primary={team.name} secondary={[
            this.renderNumberOfPlayers(team),
          ]} />
        </ListItem>
      )
    })
  }

  render() {
    const {teams} = this.props.data
    if (_.size(teams) < 2) {
      return null
    }

    return (
      <Grid item xs={12} sm={6}>
        <Paper className={styles.paper}>
          <Typography type='title' color='inherit' style={{ padding: '20px' }}>
            <PagesIcon className={styles.titleIcon} /> Teams
          </Typography>
          <List component="nav">
            {this.renderTeams()}
          </List>
        </Paper>
      </Grid>
    )
  }
}
