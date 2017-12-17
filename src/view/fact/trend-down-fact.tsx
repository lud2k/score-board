
import * as React from 'react'
import {Player, Stats} from '../../model/models'
import {Data} from '../../model/data'
import {Fact} from './fact'
import TrendingDownIcon from 'material-ui-icons/TrendingDown'
import * as _ from 'lodash'
import * as moment from 'moment'

export class TrendDownFact extends React.Component<{ data: Data, stats: Stats }, {}> {
  getNumberOfDays(bestPlayer: Player, stats: Stats): number {
    const dates = _.keys(stats.rankingsByDate).sort().reverse()
    let sinceDate = moment()
    for (let i=0; i<dates.length; i++) {
      const ranks = stats.rankingsByDate[dates[i]]
      if (ranks[ranks.length-1].playerId !== bestPlayer.id) {
        break
      }
      sinceDate = moment(dates[i])
    }
    return Math.floor(moment.duration(moment().diff(sinceDate)).asDays())
  }

  renderSecondSentence(bestPlayer: Player, stats: Stats) {
    const howManyDays = this.getNumberOfDays(bestPlayer, stats)
    if (howManyDays === 0) {
      return (
        <span>
          Just arrived at the top of the rankings.
        </span>
      )
    } else {
      return (
        <span>
          At the top the rankings for the last {howManyDays} days.
        </span>
      )
    }
  }

  render() {
    const {data, stats} = this.props
    const worstTrend = TrendDownFact.getWorstTrendDown(data, stats)
    return (
      <Fact>
        <TrendingDownIcon />
        <b>{worstTrend.player.name}</b> is going down, loosing {Math.floor(-worstTrend.change)} points!
      </Fact>
    )
  }

  static getWorstTrendDown(data: Data, stats: Stats): {change: number, player: Player} {
    if (_.size(data.players) > 3 && _.size(stats.rankingsByDate) > 3) {
      const dates = _.keys(stats.rankingsByDate).sort().reverse()
      const lastRankings = stats.rankingsByDate[dates[0]]
      const previousRankings = stats.rankingsByDate[dates[1]]

      const worstTrend: {change: number, player: Player} = {
        change: 0,
        player: null,
      }
      for (let i=0; i<lastRankings.length; i++) {
        const trend = lastRankings[i].rating - previousRankings[i].rating
        if (worstTrend.change > trend) {
          worstTrend.change = trend
          worstTrend.player = data.players[lastRankings[i].playerId]
        }
      }

      if (worstTrend.change !== 0) {
        return worstTrend
      }
    }
    return null
  }

  static canDisplay(data: Data, stats: Stats): boolean {
    return !!this.getWorstTrendDown(data, stats)
  }
}
