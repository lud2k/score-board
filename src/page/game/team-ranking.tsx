
import * as React from 'react'
import Table, { TableHead, TableRow, TableCell, TableBody } from 'material-ui/Table'
import {Data, GameStats, PlayerRanking} from '../../model/models'
import {Link} from 'react-router-dom'
import _ = require('lodash')
import PagesIcon from 'material-ui-icons/Pages'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'

const styles = require('./team-ranking.css')

export class TeamRankingsTable extends React.Component<{ data: Data, stats: GameStats }, {}> {
  getPlayersByTeam() {
    const {data, stats} = this.props
    let teamNumber = 1
    const playersByTeam = {}

    _.orderBy(stats.rankings, ['rating'], ['desc']).forEach((ranking: PlayerRanking) => {
      const player = data.players[ranking.playerId]
      if (!playersByTeam[player.teamId]) {
        playersByTeam[player.teamId] = {
          index: teamNumber++,
          best: player,
          teamId: player.teamId,
          players: {},
          ranking
        }
      }
      playersByTeam[player.teamId].players[player.id] = player
    })

    return playersByTeam
  }

  render() {
    const {data} = this.props
    const playersByTeam = this.getPlayersByTeam()

    return (
      <div className={styles.ranking}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ paddingRight: 24 }} numeric>Rank</TableCell>
              <TableCell style={{ width: '50%' }}>Team</TableCell>
              <TableCell style={{ width: '50%' }}>Best Player</TableCell>
              <TableCell numeric>Players</TableCell>
              <TableCell numeric>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.sortBy(_.values(playersByTeam), 'index').map(({index, teamId, ranking, best, players}) => (
              <TableRow key={teamId}>
                <TableCell style={{ paddingRight: 24, textAlign: 'center' }} numeric>
                  {index+1}
                </TableCell>
                <TableCell>
                  <Link to={`/team/${teamId}`}>
                    {data.teams[teamId].name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to={`/player/${best.id}`}>
                    {best.name}
                  </Link>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }} numeric>{_.size(players)}</TableCell>
                <TableCell numeric>{(ranking.rating).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export class TeamRankings extends React.Component<{ data: Data, stats: GameStats }, {}> {
  render() {
    const {data, stats} = this.props
    if (_.size(data.teams) < 2) {
      return null
    }

    return (
      <Grid item xs={12} sm={12}>
        <Paper>
          <Typography type='title' color='inherit' style={{ padding: '20px' }}>
            <PagesIcon className={styles.titleIcon} /> Team Rankings
          </Typography>
          <TeamRankingsTable data={data} stats={stats} />
        </Paper>
      </Grid>
    )
  }
}
