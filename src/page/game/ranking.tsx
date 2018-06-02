
import * as React from 'react'
import Table, { TableHead, TableRow, TableCell, TableBody } from 'material-ui/Table'
import {Data, GameStats, PlayerRanking} from '../../model/models'
import * as _ from 'lodash'
import {Link} from 'react-router-dom'

const styles = require('./ranking.css')

export class Ranking extends React.Component<{ data: Data, stats: GameStats }, {}> {
  render() {
    const {data, stats} = this.props
    const rankings = _.orderBy(stats.rankings, ['rating'], ['desc'])
    const minRating = rankings.length > 0 ? _.last(rankings).rating : 0

    return (
      <div className={styles.ranking}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ paddingRight: 24 }} numeric>Rank</TableCell>
              <TableCell style={{ width: '100%' }}>Player</TableCell>
              <TableCell numeric>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rankings.map((ranking: PlayerRanking, index: number) => (
              <TableRow key={ranking.playerId}>
                <TableCell style={{ paddingRight: 24, textAlign: 'center' }} numeric>
                  {index+1}
                </TableCell>
                <TableCell>
                  <Link to={`/player/${ranking.playerId}`}>
                    {data.players[ranking.playerId].name}
                  </Link>
                </TableCell>
                <TableCell numeric>{(ranking.rating-minRating).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}
