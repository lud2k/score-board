
import * as React from 'react'
import Menu, {MenuItem} from 'material-ui/Menu'
import ArrowDropDownIcon from 'material-ui-icons/ArrowDropDown'
import LocalActivityIcon from 'material-ui-icons/LocalActivity'
import Button from 'material-ui/Button'
import {GamesMap, Id} from '../model/models'
import * as _ from 'lodash'

export class GameMenu extends React.Component<{ games: GamesMap, selected: Id,
  onChange: (selected: Id) => void }, { anchorEl: any, open: boolean }> {

  constructor(props: any) {
    super(props)

    this.state = {
      anchorEl: null,
      open: false,
    }
  }

  onClick = (event: any) => {
    this.setState({ open: true, anchorEl: event.currentTarget })
  }

  handleRequestClose = (event: any, selected?: Id) => {
    this.setState({ open: false })
    if (selected && selected !== 'backdropClick') {
      this.props.onChange(selected)
    }
  }

  render() {
    const games = _.values(this.props.games)
    if (games.length <= 1) {
      return null
    }

    return (
      <div>
        <Button color='contrast' onClick={this.onClick}>
          <LocalActivityIcon />&nbsp;&nbsp;
          {this.props.games[this.props.selected].name} <ArrowDropDownIcon />
        </Button>
        <Menu anchorEl={this.state.anchorEl}
              open={this.state.open}
              onClose={this.handleRequestClose}>
          {games.map((game) => (
            <MenuItem
              key={game.id}
              value={game.id}
              selected={game.id === this.props.selected}
              onClick={(event) => this.handleRequestClose(event, game.id)}>
              {game.name}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}
