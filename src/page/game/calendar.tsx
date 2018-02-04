
import * as React from 'react'
import {Score, Stats} from '../../model/models'
import * as _ from 'lodash'
import {Data} from '../../model/data'
import * as moment from 'moment'
import { Moment } from 'moment'
import Popover from 'material-ui/Popover'

const styles = require('./calendar.css')

export class Calendar extends React.Component<{ data: Data, stats: Stats },
    { overElement: EventTarget, overScores: Score[] }> {

  constructor(props: any) {
    super(props)

    this.state = {
      overElement: null,
      overScores: null,
    }
  }

  onMouseOver(scores: Score[], event: any) {
    this.setState({ overElement: event.target, overScores: scores })
  }

  onMouseOut() {
    this.setState({ overElement: null, overScores: null })
  }

  getDates(): Array<Array<Moment>> {
    let date = moment().date(28).day(7).subtract(7*5*5, 'days')
    const datesArray: Array<Array<Moment>> = []
    for (let i=0; i<5; i++) {
      const datesRow: Array<Moment> = []
      for (let j=0; j<7*5; j++) {
        datesRow.push(date)
        date = date.clone().add(1, 'day')
      }
      datesArray.push(datesRow)
    }
    return datesArray

  }

  renderRow(datesRow: Array<Moment>) {
    return datesRow.map((date, index) => {
      const day = date.day()
      const dayType = (day === 0 || day === 6) ? 'week-end' : 'week-day'
      const dateString = date.format('YYYY-MM-DD')
      const scores = _.filter(this.props.data.scores, (score) => score.date === dateString)
      const activity = Math.min(15, scores.length)
      const transparency = Math.log(1+activity/8.75)
      return (
        <div className={`calendar-day ${dayType}`}
             style={dayType !== 'week-end' ? { backgroundColor: `rgba(63, 81, 181, ${transparency})` } : {}}
             key={index}
             onMouseOut={this.onMouseOut.bind(this)}
             onMouseOver={this.onMouseOver.bind(this, scores)}/>
      )
    })
  }

  renderMonth(datesRow: Array<Moment>) {
    const month = datesRow[Math.floor(datesRow.length/2)].format('MMMM')
    return (
      <div className='calendar-month-name'>
        {month}
      </div>
    )
  }

  renderRows(datesArray: Array<Array<Moment>>) {
    return datesArray.map((datesRow, index) => (
      <div className='calendar-month' key={index}>
        {this.renderMonth(datesRow)}
        {this.renderRow(datesRow)}
      </div>
    ))
  }

  renderPopoverContent() {
    if (_.isEmpty(this.state.overScores)) {
      return null
    }

    const games: any = {}
    this.state.overScores.forEach((score) => {
      const key = [score.playerId1, score.playerId2].sort().join('_')
      const winnerId = score.score1 > score.score2 ? score.playerId1 : score.playerId2
      if (!games[key]) {
        games[key] = {
          players: [score.playerId1, score.playerId2],
          [score.playerId1]: 0,
          [score.playerId2]: 0,
        }
      }
      games[key][winnerId]++
    })
    return _.values(games).map((game) => {
      const players = this.props.data.players
      return (
        <tr>
          <td>{players[game.players[0]].name}</td>
          <td>{game[game.players[0]]}</td>
          <td>vs</td>
          <td>{players[game.players[1]].name}</td>
          <td>{game[game.players[1]]}</td>
        </tr>
      )
    })
  }

  renderSelectedDate() {
    if (this.state.overElement && !_.isEmpty(this.state.overScores)) {
      return (
        <div className={styles.date}>
          {moment(this.state.overScores[0].date).format('dddd, MMMM Do YYYY')}
        </div>
      )
    }
  }

  render() {
    const {data, stats} = this.props
    const datesArray = this.getDates()

    return (
      <div className={styles.calendarWrapper}>
        <div className='calendar'>
          {this.renderRows(datesArray)}
        </div>
        <Popover
          title='Name here'
          className={styles.tooltip}
          anchorOrigin={{
            vertical: -10,
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          elevation={0}
          anchorEl={this.state.overElement}
          open={!!this.state.overElement && !_.isEmpty(this.state.overScores)}>
          {this.renderSelectedDate()}
          <table className={styles.tooltipContent}>
            {this.renderPopoverContent()}
          </table>
        </Popover>
      </div>
    )
  }
}
