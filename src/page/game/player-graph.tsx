
import * as React from 'react'
import Popover from 'material-ui/Popover'
import Chip from 'material-ui/Chip'
import * as d3 from 'd3'
import {Id, Player, PlayerRanking, Stats} from '../../model/models'
import {SimulationNodeDatum} from 'd3-force'
import * as _ from 'lodash'
import {Data} from '../../model/data'
import {PlayerAvatar} from './player-avatar'

const styles = require('./player-graph.css')

interface Node extends SimulationNodeDatum {
  id: string
  size: number
}

interface Link {
  source: string,
  target: string,
  value: number
}

export class PlayerGraph extends React.Component<{ data: Data, stats: Stats },
    { overElement: EventTarget, overNode: any }> {
  ele: SVGElement

  constructor(props: any) {
    super(props)

    this.state = {
      overElement: null,
      overNode: null,
    }
  }

  getNodes(): Node[] {
    const {data, stats} = this.props

    const rankings = stats.rankings
    const rankingOfPlayer = (player: Player) => {
      const playerRank = _.find<PlayerRanking>(rankings, {playerId: player.id})
      return playerRank ? playerRank.normalizedRating*4+3 : 3
    }

    return _.values(data.players)
      .map((player) => ({ id: player.id, color: player.color, size: rankingOfPlayer(player) }))
  }

  getLinks(): Link[] {
    const links = {}

    _.values(this.props.data.scores).forEach((score) => {
      if (!links[score.playerId1]) {
        links[score.playerId1] = {}
      }
      if (!links[score.playerId2]) {
        links[score.playerId2] = {}
      }
      if (!links[score.playerId1][score.playerId2]) {
        links[score.playerId1][score.playerId2] = { playerId: score.playerId2, count: 0 }
      }
      if (!links[score.playerId2][score.playerId1]) {
        links[score.playerId2][score.playerId1] = { playerId: score.playerId1, count: 0 }
      }
      links[score.playerId1][score.playerId2].count++
      links[score.playerId2][score.playerId1].count++
    })

    for (const playerId1 in links) {
      const sorted = _.sortBy(_.values(links[playerId1]), 'count')
      sorted.forEach((entry: any, index: number) => {
        entry.prefered = index/sorted.length
      })
    }

    const seen = {}
    const ret = []
    for (const playerId1 in links) {
      for (const playerId2 in links[playerId1]) {
        if (!seen[`${playerId1}_${playerId2}`]) {
          seen[`${playerId1}_${playerId2}`] = seen[`${playerId2}_${playerId1}`] = true
          ret.push({
            source: playerId1,
            target: playerId2,
            value: 1 + Math.min(links[playerId1][playerId2].prefered*links[playerId2][playerId1].prefered*4, 3),
          })
        }
      }
    }
    return ret
  }

  onMouseOver(node: any, index: number, circles: HTMLElement[]) {
    this.setState({ overElement: circles[index], overNode: node })
  }

  onMouseOut() {
    this.setState({ overElement: null })
  }

  onDragStart(d: any, simulation: any) {
    if (!d3.event.active) {
      simulation.alphaTarget(0.3).restart()
    }
    d.fx = d.x
    d.fy = d.y
  }

  onDrag(d: any, simulation: any) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  onDragEnd(d: any, simulation: any) {
    if (!d3.event.active) {
      simulation.alphaTarget(0)
    }
    d.fx = null
    d.fy = null
  }

  renderSvg() {
    // Remove everything in the svg node
    this.ele.innerHTML = ''

    const svg = d3.select(this.ele)
    const links = this.getLinks()
    const nodes = this.getNodes()
    const rect = this.ele.getBoundingClientRect()

    const simulation = d3.forceSimulation<Node>()
      .force('link', d3.forceLink().id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(rect.width/2, rect.height/2))

    const link = svg.append('g')
      .attr('stroke', '#CCCCCC')
      .selectAll('line')
      .data<Link>(links)
      .enter().append('line')
      .attr('stroke-width', (d) => d.value)

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data<Node>(nodes)
      .enter().append('circle')
      .attr('r', (d: any) => d.size)
      .attr('fill', (d: any) => d.color)
      .on('mouseover', this.onMouseOver.bind(this))
      .on('mouseout', this.onMouseOut.bind(this))
      .call(d3.drag<any, Node>()
        .on('start', (d: any) => this.onDragStart(d, simulation))
        .on('drag', (d: any) => this.onDrag(d, simulation))
        .on('end', (d: any) => this.onDragEnd(d, simulation)),
      )

    const ticked = () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y)
    }

    simulation
      .nodes(nodes)
      .on('tick', ticked)

    simulation.force<any>('link')
      .links(links)
  }

  componentDidMount() {
    this.renderSvg()
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.data !== this.props.data) {
      this.renderSvg()
    }
  }

  render() {
    const player = this.state.overNode && this.props.data.players[this.state.overNode.id]
    return (
      <div>
        <svg width='100%' height='390px' ref={(ele) => this.ele = ele} />
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
          open={!!this.state.overElement}>
          <Chip label={player && player.name} />
        </Popover>
      </div>
    )
  }
}
