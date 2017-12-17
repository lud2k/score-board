
import * as React from 'react'
import Button from 'material-ui/Button'
import {AppConfig} from '../../config'
import ViewListIcon from 'material-ui-icons/ViewList'

const GOOGLE_SHEET_URL = (sheetId: string) =>
  `https://docs.google.com/spreadsheets/u/1/d/${sheetId}/edit`

export class AddEntry extends React.Component<{config: AppConfig}, {}> {
  onClickAdd() {
    // open Google Sheets in a new tab
    window.open(GOOGLE_SHEET_URL(this.props.config.backend.sheetId))
  }

  render() {
    return (
      <Button color='contrast' onClick={this.onClickAdd.bind(this)}>
        <ViewListIcon />&nbsp;
        Add Entry
      </Button>
    )
  }
}
