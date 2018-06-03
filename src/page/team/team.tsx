
import * as React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Grid from 'material-ui/Grid'
import {Data, Id, Stats} from '../../model/models'
import {MenuIconPopover} from '../common/menu-icon-popover'
import {AppConfig} from '../../config'
import {Title} from '../common/title'
import {Players} from './players'

const styles = require('./team.css')

export class Team extends React.Component<{ data: Data, stats: Stats, config: AppConfig,
  teamId: Id }, {}> {

  render() {
    const {data, stats, config, teamId} = this.props
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
            <Players data={data} stats={stats} teamId={teamId} config={config}/>
          </Grid>
        </div>
      </div>
    )
  }
}
