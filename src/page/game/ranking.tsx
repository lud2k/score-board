
import * as React from 'react'
import Table, { TableHead, TableRow, TableCell, TableBody } from 'material-ui/Table'
import {Data, GameStats, PlayerRanking} from '../../model/models'
import * as _ from 'lodash'
import {Link} from 'react-router-dom'
import {SortableTable, TableColumn} from '../common/sortable-table'

const styles = require('./ranking.css')

export class Ranking extends React.Component<{ data: Data, stats: GameStats }, {}> {
  getColumns(): TableColumn[] {
    return [
      {key: 'rank', label: 'Rank', numeric: true},
      {key: 'player', label: 'Player', numeric: false},
      {key: 'rating', label: 'Rating', numeric: true},
    ]
  }

  renderRow = (row: any, column: TableColumn) => {
    if (column.key === 'player') {
      return <Link to={`/player/${row.player.id}`}>{row.player.name}</Link>
    }
    return row[column.key]
  }

  computeTableData(): any[] {
    const {data, stats} = this.props
    const rankings = _.orderBy(stats.rankings, ['rating'], ['desc'])
    const minRating = rankings.length > 0 ? _.last(rankings).rating : 0
    return rankings.map((ranking, index) => ({
      player: data.players[ranking.playerId],
      rank: index+1,
      rating: (ranking.rating-minRating).toFixed(2),
    }))
  }

  render() {
    const {data} = this.props
    const tableData = this.computeTableData()

    return (
      <div className={styles.ranking}>
        <SortableTable className={styles.table} defaultOrderBy={[false, 'rank']} data={tableData}
                       columns={this.getColumns()} rowRenderer={this.renderRow} rowsPerPage={7} />
      </div>
    )
  }
}
