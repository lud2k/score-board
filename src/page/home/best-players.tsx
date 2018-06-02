
import * as React from 'react'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import WhatshotIcon from 'material-ui-icons/Whatshot'
import StarIcon from 'material-ui-icons/Star'
import {Data, Game, GameStats, Id, Player, Score, Stats} from '../../model/models'
import {AppConfig} from '../../config'
import * as _ from 'lodash'
import {SortableTable, TableColumn} from '../common/sortable-table'
import {Link} from 'react-router-dom'
import Tooltip from 'material-ui/Tooltip'

const styles = require('./best-players.css')

interface Badge {
  rank: number
  gameId: string
}

export class BestPlayers extends React.Component<{ data: Data, stats: Stats,
  config: AppConfig }, {}> {

  computeAverageRanking(player: Player, stats: Stats): number {
    let result = 0
    _.forEach(stats.games, (stat) => {
      const rank = _.findIndex(stat.rankings, {playerId: player.id})
      result += rank === -1 ? _.size(stat.rankings) : (rank+1)
    })
    return result / _.size(stats.games)
  }

  computeBadges(player: Player, stats: Stats): Badge[] {
    const result: {rank: number, gameId: string}[] = []
    _.forEach(stats.games, (stat, gameId) => {
      if (stat.rankings[0].playerId === player.id) {
        result.push({rank: 1, gameId})
      } else if (stat.rankings[1].playerId === player.id) {
        result.push({rank: 2, gameId})
      } else if (stat.rankings[2].playerId === player.id) {
        result.push({rank: 3, gameId})
      }
    })
    return _.orderBy(result, ['rank'], ['desc'])
  }

  computeTableData(): any[] {
    const { data: {players, games, scores, teams}, stats } = this.props
    return _.map(players, (player) => {
      const badges = this.computeBadges(player, stats)
      return {
        id: player.id,
        player: player,
        team: teams[player.teamId],
        rank: this.computeAverageRanking(player, stats),
        badgesValue: badges.reduce((prev, badge) => prev + (4-badge.rank)*2, 0),
        badges: badges
      }
    })
  }

  renderRow(row: any, column: TableColumn) {
    if (column.key === 'player') {
      return <Link to={`/player/${row.player.id}`}>{row.player.name}</Link>
    } else if (column.key === 'team') {
      if (row.team) {
        return <Link to={`/team/${row.team.id}`}>{row.team.name}</Link>
      } else {
        return 'N/A'
      }
    } else if (column.key === 'badgesValue') {
      const {games} = this.props.data
      return row.badges.map((badge: Badge) => {
        const ranks = {
          1: '1st',
          2: '2nd',
          3: '3rd',
        }
        return (
          <Tooltip title={`${row.player.name} is ${ranks[badge.rank]} at ${games[badge.gameId].name}`}>
            <StarIcon className={styles.badgeIcon} data-value={badge.rank} />
          </Tooltip>
        )
      })
    }
    return row[column.key]
  }

  getColumns(): TableColumn[] {
    const {teams} = this.props.data
    const ret = [
      {key: 'player', label: 'Player', numeric: false},
      {key: 'badgesValue', label: 'Badges', numeric: false},
      {key: 'rank', label: 'Rank', numeric: true},
    ]
    if (_.size(teams) >= 2) {
      ret.splice(1, 0, {key: 'team', label: 'Team', numeric: false})
    }
    return ret
  }

  render() {
    const data = this.computeTableData()
    return (
      <Grid item xs={12} sm={12}>
        <Paper className={styles.paper}>
          <Typography type='title' color='inherit' style={{ padding: '20px' }}>
            <WhatshotIcon className={styles.titleIcon} /> Players
          </Typography>
          <SortableTable className={styles.table} defaultOrderBy={[false, 'rank']} data={data}
                         columns={this.getColumns()} rowRenderer={this.renderRow.bind(this)} />
        </Paper>
      </Grid>
    )
  }
}
