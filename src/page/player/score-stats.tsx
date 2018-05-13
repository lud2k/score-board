
import * as React from 'react'
import Table, { TableHead, TableRow, TableCell, TableBody } from 'material-ui/Table'
import {Data, Id, Score} from '../../model/models'
import Tooltip from 'material-ui/Tooltip'
import * as _ from 'lodash'
import {Link} from 'react-router-dom'

const styles = require('./score-stats.css')

export class ScoreStats extends React.Component<{ data: Data, playerId: Id }, {}> {
  getTooltipTitle(won: number, count: number, opponentId: Id) {
    const {data, playerId} = this.props
    if (won === 0) {
      return (
        <div className={styles.tooltip}>
          Over the last {count} games, {data.players[playerId].name} has
          won as many games as {data.players[opponentId].name}
        </div>
      )
    } else if (won > 0) {
      return (
        <div className={styles.tooltip}>
          Over the last {count} games, {data.players[playerId].name} has
          won {won} more games than {data.players[opponentId].name}
        </div>
      )
    } else if (won < 0) {
      return (
        <div className={styles.tooltip}>
          Over the last {count} games, {data.players[playerId].name} has
          lost {-won} more games than {data.players[opponentId].name}
        </div>
      )
    }
  }

  renderStat(scoreStat: { scores: Score[], playerId: Id }, count: number) {
    let ret = 0
    let current = count
    for (let i=0; i<scoreStat.scores.length && current > 0; i++) {
      const score = scoreStat.scores[i]
      if (score.playerId1 === this.props.playerId) {
        ret += score.score1 > score.score2 ? 1 : -1
      }
      if (score.playerId2 === this.props.playerId) {
        ret += score.score2 > score.score1 ? 1 : -1
      }
      current--
    }
    if (current > 0) {
      return null
    }
    return (
      <Tooltip title={this.getTooltipTitle(ret, count, scoreStat.playerId)}>
        <span>{ret > 0 ? `+${ret}` : ret}</span>
      </Tooltip>
    )
  }

  render() {
    const {data, playerId} = this.props
    const scoresPerPlayer = _.values(data.scores)
      .reduce((res: {any: Score[]}, score: Score): {any: Score[]} => {
        if (playerId === score.playerId1) {
          if (!res[score.playerId2]) {
            res[score.playerId2] = []
          }
          res[score.playerId2].push(score)
        } else if (playerId === score.playerId2) {
          if (!res[score.playerId1]) {
            res[score.playerId1] = []
          }
          res[score.playerId1].push(score)
        }
        return res
      }, {})
    const scoresPerPlayerList = _.sortBy(_.map(scoresPerPlayer, (scores: Score[], otherPlayerId: Id) => ({
      scores: _.orderBy(scores, ['date'], ['desc']),
      playerId: otherPlayerId,
    })), (item) => -item.scores.length)

    return (
      <div className={styles.scoreStats}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={styles.playerColumn}>Player</TableCell>
              <TableCell className={styles.lastColumn}>60</TableCell>
              <TableCell className={styles.lastColumn}>30</TableCell>
              <TableCell className={styles.lastColumn}>14</TableCell>
              <TableCell className={styles.lastColumn}>7</TableCell>
              <TableCell className={styles.lastColumn}>3</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scoresPerPlayerList.map((scoreStat) => (
              <TableRow key={scoreStat.playerId}>
                <TableCell>
                  <Link to={`/player/${scoreStat.playerId}`}>
                    {data.players[scoreStat.playerId].name}
                  </Link>
                </TableCell>
                <TableCell className={styles.lastColumn}>{this.renderStat(scoreStat, 60)}</TableCell>
                <TableCell className={styles.lastColumn}>{this.renderStat(scoreStat, 30)}</TableCell>
                <TableCell className={styles.lastColumn}>{this.renderStat(scoreStat, 14)}</TableCell>
                <TableCell className={styles.lastColumn}>{this.renderStat(scoreStat, 7)}</TableCell>
                <TableCell className={styles.lastColumn}>{this.renderStat(scoreStat, 3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}
