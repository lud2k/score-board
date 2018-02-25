
import * as React from 'react'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import {Data, PlayerRanking, Score, Stats} from '../../model/models'
import StarIcon from 'material-ui-icons/Star'
import StarBorderIcon from 'material-ui-icons/StarBorder'
import StarHalfIcon from 'material-ui-icons/StarHalf'

interface Leader {
  name: string
  victories: number
}

export class Rising extends React.Component<{ data: Data, stats: Stats }, {}> {
  render() {
    const {data, stats} = this.props
    const icons = [<StarIcon />, <StarHalfIcon />, <StarBorderIcon />]
    const rankings = stats.rankings.reverse().slice(0, 3) as PlayerRanking[]

    return (
      <List>
        {rankings.map((ranking, index) => (
          <ListItem key={index}>
            <ListItemText primary={data.players[ranking.playerId].name} />
          </ListItem>
        ))}
      </List>
    )
  }
}
