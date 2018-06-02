
import * as React from 'react'
import {Data, GameStats, Player} from '../../../model/models'
import {Fact} from './fact'
import WhatshotIcon from 'material-ui-icons/Whatshot'
import * as _ from 'lodash'
import * as moment from 'moment'
import {Link} from 'react-router-dom'

export class BestPlayerFact extends React.Component<{ data: Data, stats: GameStats }, {}> {
  getNumberOfDays(bestPlayer: Player, stats: GameStats): number {
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

  renderSecondSentence(bestPlayer: Player, stats: GameStats) {
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
    const bestPlayer = BestPlayerFact.getBestPlayer(data, stats)
    const game = _.values(data.games)[0]
    return (
      <Fact>
        <WhatshotIcon />
        <Link to={`/player/${bestPlayer.id}`}><b>{bestPlayer.name}</b></Link> is the best {game.name} player!&nbsp;
        {this.renderSecondSentence(bestPlayer, stats)}
      </Fact>
    )
  }

  static getBestPlayer(data: Data, stats: GameStats): Player {
    if (_.size(data.players) > 2) {
      const rankings = stats.rankings
      return data.players[rankings[0].playerId]
    }
  }

  static canDisplay(data: Data, stats: GameStats): boolean {
    return !!this.getBestPlayer(data, stats)
  }
}
