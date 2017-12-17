
import * as React from 'react'
import {Stats} from '../model/models'
import * as _ from 'lodash'
import {Data} from '../model/data'
import * as moment from 'moment'
import { Moment } from 'moment'

const styles = require('./calendar.css')

export class Calendar extends React.Component<{ data: Data, stats: Stats }, {}> {
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
      const count = _.filter(this.props.data.scores, (score) => score.date === dateString).length
      const activity = Math.min(5, count)
      return (
        <div className={`calendar-day ${dayType}`} data-activity={activity} key={index} />
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

  render() {
    const {data, stats} = this.props
    const datesArray = this.getDates()

    return (
      <div className={styles.calendarWrapper}>
        <div className='calendar'>
          {this.renderRows(datesArray)}
        </div>
      </div>
    )
  }
}
