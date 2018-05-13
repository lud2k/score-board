
import * as React from 'react'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/Menu/MenuItem'
import {ChangeEvent} from 'react'
import {Id, Team, TeamMap} from '../../model/models'
import _ = require('lodash')

export class TeamSelectField extends React.Component<{ teams: TeamMap, value: Id,
  label: string, onChange: (teamId: Id) => void}, {}> {

  onChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(event.currentTarget.value+'')
  }

  render() {
    const {label, value, teams} = this.props
    return (
      <TextField select label={label} fullWidth value={value} onChange={this.onChange}>
        {_.sortBy(_.values(teams), 'name').map((team: Team) => (
          <MenuItem key={team.id} value={team.id}>
            {team.name}
          </MenuItem>
        ))}
      </TextField>
    )
  }
}
