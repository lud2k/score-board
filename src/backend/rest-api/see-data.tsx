
import * as React from 'react'
import Button from 'material-ui/Button'
import {AppConfig} from '../../config'
import ViewListIcon from 'material-ui-icons/ViewList'

export class SeeData extends React.Component<{config: AppConfig}, {}> {
  onClickAdd() {
    // open Google Sheets in a new tab
    window.open(this.props.config.backend.dataUrl)
  }

  render() {
    if (!this.props.config.backend.dataUrl) {
      return null
    }

    return (
      <Button color='contrast' onClick={this.onClickAdd.bind(this)}>
        <ViewListIcon />&nbsp;
        Data
      </Button>
    )
  }
}
