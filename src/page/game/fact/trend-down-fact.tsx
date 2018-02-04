
import * as React from 'react'
import {Player, Stats} from '../../../model/models'
import {Data} from '../../../model/data'
import {Fact} from './fact'
import TrendingDownIcon from 'material-ui-icons/TrendingDown'
import * as _ from 'lodash'
import * as moment from 'moment'
import {Link} from 'react-router-dom'

export class TrendDownFact extends React.Component<{ data: Data, stats: Stats }, {}> {
  render() {
    const {data, stats} = this.props
    const worstTrend = TrendDownFact.getWorstTrendDown(data, stats)
    return (
      <Fact>
        <TrendingDownIcon />
        <Link to={`/player/${worstTrend.player.id}`}><b>{worstTrend.player.name}</b></Link> is
        going down, loosing {Math.floor(-worstTrend.change)} points!
      </Fact>
    )
  }

  static getWorstTrendDown(data: Data, stats: Stats): {change: number, player: Player} {
    if (_.size(data.players) > 3 && _.size(stats.rankingsByDate) > 3) {
      const dates = _.keys(stats.rankingsByDate).sort().reverse()
      const lastRankings = _.sortBy(stats.rankingsByDate[dates[0]], 'playerId')
      const previousRankings = _.sortBy(stats.rankingsByDate[dates[1]], 'playerId')

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
