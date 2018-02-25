
import * as React from 'react'
import Table, { TableHead, TableRow, TableCell, TableBody } from 'material-ui/Table'
import * as _ from 'lodash'
import {Data} from '../../model/models'

export class RecentGamesBody extends React.Component<{ data: Data }, {}> {
  getLatestScores(data: Data) {
    return _.values(data.scores)
      .sort((score1, score2) => {
        if (score1.date === score2.date) {
          return score1.id > score2.id ? 1 : -1
        } else {
          return score1.date > score2.date ? 1 : -1
        }
      })
      .slice(-5)
  }

  render() {
    const {data} = this.props
    const latestScores = this.getLatestScores(data)
    return (
      <TableBody>
        {latestScores.map((score) => (
          <TableRow key={score.id}>
            <TableCell>{score.date}</TableCell>
            <TableCell>
              <b>{data.players[score.playerId1].name}</b> ({score.score1})
              &nbsp;vs&nbsp;
              <b>{data.players[score.playerId2].name}</b> ({score.score2})
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    )
  }
}

export class RecentGames extends React.Component<{ data: Data }, {}> {
  render() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Players &amp; Scores</TableCell>
          </TableRow>
        </TableHead>
        <RecentGamesBody data={this.props.data} />
      </Table>
    )
  }
}
