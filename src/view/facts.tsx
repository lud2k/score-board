
import * as React from 'react'
import {Stats} from '../model/models'
import {Data} from '../model/data'
import * as _ from 'lodash'
import {BestPlayerFact} from './fact/best-player-fact'
import {SecondPlayerFact} from './fact/second-player-fact'
import {TrendDownFact} from './fact/trend-down-fact'

export class Facts extends React.Component<{ data: Data, stats: Stats }, {}> {
  render() {
    const {data, stats} = this.props
    if (_.isEmpty(data.scores)) {
      return null
    }

    const facts = [BestPlayerFact, SecondPlayerFact, TrendDownFact]
    return facts.filter((fact) => fact.canDisplay(data, stats))
      .map((fact) => {
        const props = {...this.props, key: fact.name}
        return React.createElement(fact, props)
      })
  }
}
