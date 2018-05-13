
import * as React from 'react'
import Paper from 'material-ui/Paper'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Grid from 'material-ui/Grid'
import {Data, Id} from '../../model/models'
import {MenuIconPopover} from '../common/menu-icon-popover'
import {AppConfig} from '../../config'
import {Title} from '../common/title'

const styles = require('./team.css')

export class Team extends React.Component<{ data: Data, config: AppConfig, teamId: Id }, {}> {
  render() {
    const {data, config, teamId} = this.props
    return (
      <div>
        <AppBar position='static'>
          <Toolbar>
            <MenuIconPopover data={data} />
            <Title config={config} section='Team' subSection={data.teams[teamId].name} />
          </Toolbar>
        </AppBar>
        <div className={styles.content}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={12}>
              <Paper>
                No content yet. Maybe one day!
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}
