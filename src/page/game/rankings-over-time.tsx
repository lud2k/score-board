
import * as React from 'react'
import Popover from 'material-ui/Popover'
import Chip from 'material-ui/Chip'
import * as d3 from 'd3'
import {Data, GameStats, Id, PlayerRanking} from '../../model/models'
import * as _ from 'lodash'

const styles = require('./rankings-over-time.css')

interface Node {
  id: string
  size: number
}

interface Link {
  source: string,
  target: string,
  value: number
}

export class RankingsOverTime extends React.Component<{ data: Data, stats: GameStats },
  { overElement: EventTarget, overNode: any }> {

  ele: SVGElement

  constructor(props: any) {
    super(props)

    this.state = {
      overElement: null,
      overNode: null,
    }
  }

  renderSvg() {
    // Remove everything in the svg node
    this.ele.innerHTML = ''

    const margin = {top: 10, right: 40, bottom: 75, left: 40}
    const width = this.ele.clientWidth - margin.left - margin.right // Use the window's width
    const height = 350
    const {data: {players}, stats} = this.props

    const rankings = _.mapValues(stats.rankingsByDate, (rankings) => _.keyBy(rankings, 'playerId'))
    const dates = _.keys(rankings).sort().slice(-50)
    const playersIds = _.keys(rankings[dates[0]])

    const xScale = d3.scaleLinear()
      .domain([0, dates.length-1])
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0])

    const line = d3.line<PlayerRanking>()
      .x((d, i) => xScale(i))
      .y((d: PlayerRanking) => yScale(d.normalizedRating))
      .curve(d3.curveMonotoneX)

    const svg = d3.select(this.ele)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale).tickFormat((index: number) => dates[index]))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)')

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(0))

    playersIds.forEach((playerId: Id) => {
      const playerRankings = dates.map((date) => rankings[date][playerId])

      svg.append('path')
        .datum(playerRankings)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('d', line)
    })

    playersIds.forEach((playerId: Id) => {
      const playerRankings = dates.map((date) => rankings[date][playerId])

      svg.selectAll('.dot')
        .data(playerRankings)
        .enter()
        .append('circle')
        .attr('fill', (d: any) => players[playerId].color)
        .attr('cx', (d, i) => xScale(i))
        .attr('cy', (d) => yScale(d.normalizedRating))
        .on('mouseover', this.onMouseOver.bind(this))
        .on('mouseout', this.onMouseOut.bind(this))
        .attr('r', (d: PlayerRanking, i: number) => {
          if ((i > 0 && playerRankings[i].normalizedRating !== playerRankings[i-1].normalizedRating) ||
            (i < playerRankings.length-1 && playerRankings[i].normalizedRating !== playerRankings[i+1].normalizedRating)) {
            return 3
          } else {
            return 0
          }
        })
    })
  }

  componentDidMount() {
    this.renderSvg()
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.data !== this.props.data) {
      this.renderSvg()
    }
  }

  onMouseOver(node: any, index: number, circles: HTMLElement[]) {
    this.setState({ overElement: circles[index], overNode: node })
  }

  onMouseOut() {
    this.setState({ overElement: null })
  }

  render() {
    return (
      <div>
        <svg width='100%' height='390px' ref={(ele) => this.ele = ele} />
        <Popover
          title='Name here'
          className={styles.tooltip}
          anchorOrigin={{
            horizontal: 'center',
            vertical: -10,
          }}
          transformOrigin={{
            horizontal: 'center',
            vertical: 'bottom',
          }}
          elevation={0}
          anchorEl={this.state.overElement}
          open={!!this.state.overElement}>
          <Chip label={this.state.overNode && this.props.data.players[this.state.overNode.playerId] &&
            this.props.data.players[this.state.overNode.playerId].name} />
        </Popover>
      </div>
    )
  }
}
