
import * as React from 'react'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/Menu/MenuItem'
import {ChangeEvent} from 'react'
import {Id, Player, PlayersMap} from '../../model/models'
import _ = require('lodash')

export class PlayerSelectField extends React.Component<{ players: PlayersMap, value: Id,
  label: string, onChange: (playerId: Id) => void}, {}> {

  onChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(event.currentTarget.value+'')
  }

  render() {
    return (
      <TextField select label={this.props.label} fullWidth value={this.props.value}
                 onChange={this.onChange}>
        {_.sortBy(_.values(this.props.players), 'name').map((player: Player) => (
          <MenuItem key={player.id} value={player.id}>
            {player.name}
          </MenuItem>
        ))}
      </TextField>
    )
  }
}
