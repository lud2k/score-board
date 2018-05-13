
import * as React from 'react'
import {Data} from '../../model/models'
import * as d3 from 'd3'
import * as _ from 'lodash'

const styles = require('./game-donut-chart.css')

export class GameDonutChart extends React.Component<{ data: Data }, {}> {
  ele: SVGElement

  constructor(props: any) {
    super(props)
  }

  componentDidMount() {
    this.renderDonutChart()
  }

  renderDonutChart() {
    /*
    const playersByTeam = _.reduce(this.props.data.players, (ret, player) => {
      if (!ret[player.teamId]) {
        ret[player.teamId] = {}
      }
      ret[player.teamId][player.id] = player
      return ret
    }, {})
    const dataset = _.map(playersByTeam, (value, key) => ({ teamId: key, count: _.size(value) }))
    const nbPlayers = _.reduce(dataset, (ret, entry) => (ret + entry.count), 0)

    const width = 109
    const radius = width / 2
    const donutWidth = 25

    const color = d3.scaleOrdinal(d3.schemeCategory20b);

    const svg = d3.select(this.ele)
      .attr('width', width)
      .attr('height', width)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) + ',' + (width / 2) + ')')

    const arc = d3.arc()
      .innerRadius(radius - donutWidth)             // UPDATED
      .outerRadius(radius)

    const pie = d3.pie()
      .value((d) => { return d.count; })
      .sort(null)

    const path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .transition()
      .attr('fill', function(d, i) {
        return color(d.data.teamId);
      })
      .transition()
      .delay((d,i) => {
        const total = dataset.slice(0,i).reduce((ret, ele) => (ret + ele.count), 0)
        return 500 * total / nbPlayers
      })
      .duration((d,i) => {
        return 500 * dataset[i].count / nbPlayers
      })
      .ease(d3.easeLinear)
      .attrTween('d', function(d) {
        var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
        return function(t) {
          d.endAngle = i(t);
          return arc(d)
        }
      });
      */
  }

  render() {
    return (
      <div className={styles.gameDonutChart}>
        <svg ref={(ele) => this.ele = ele} />
      </div>
    )
  }
}
