
import * as React from 'react'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import Popover from 'material-ui/Popover'
import {MouseEvent} from 'react'
import {Data, Game, Score} from '../../model/models'
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List'
import _ = require('lodash')

const styles = require('./menu-icon-popover.css')

export class MenuIconPopover extends React.Component<{ data: Data },
  { buttonElement: HTMLElement }> {

  constructor(props: any) {
    super(props)

    this.state = {
      buttonElement: null,
    }
  }

  onClickIcon = (event: MouseEvent<HTMLElement>) => {
    this.setState({ buttonElement: event.currentTarget })
  }

  onClose = () => {
    this.setState({ buttonElement: null })
  }

  onClickMenuItem = (href: string) => {
    location.hash = `#${href}`
    this.setState({ buttonElement: null })
  }

  renderMenuItems(): any {
    const items: any[] = []
    const {data} = this.props
    _.values(data.games).forEach((game: Game) => {
      const scores = _.values(data.scores).filter((score) => score.gameId === game.id)
      const players = scores.reduce((res: any, score: Score) => {
        res[score.playerId1] = res[score.playerId2] = true
        return res
      }, {})
      const subText = `${scores.length} scores | ${_.size(players)} players`
      items.push(
        <ListItem button onClick={(event) => this.onClickMenuItem(`/game/${game.id}`)}>
          <ListItemText primary={game.name} secondary={subText} />
        </ListItem>,
      )
    })
    return items
  }

  onClickHome() {
    location.hash = `#/`
  }

  renderHomeMenuItems() {
    return (
      <ListItem button onClick={(event) => this.onClickHome()}>
        <ListItemText primary='Home' secondary='General stats' />
      </ListItem>
    )
  }

  render() {
    const {buttonElement} = this.state

    return (
      <div>
        <IconButton color='inherit' onClick={(event: any) => this.onClickIcon(event)}>
          <MenuIcon />
        </IconButton>
        <Popover
          open={Boolean(buttonElement)}
          anchorEl={buttonElement}
          anchorReference='anchorEl'
          anchorPosition={{ top: 200, left: 200 }}
          onClose={this.onClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <List component='nav' subheader={<ListSubheader component='div'>Pages</ListSubheader>}>
            {this.renderHomeMenuItems()}
          </List>
          <List component='nav' subheader={<ListSubheader component='div'>Games</ListSubheader>}>
            {this.renderMenuItems()}
          </List>
        </Popover>

      </div>
    )
  }
}
