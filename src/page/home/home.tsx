
import * as React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import {AppConfig} from '../../config'
import {MenuIconPopover} from '../common/menu-icon-popover'
import {Data, Stats} from '../../model/models'
import {Title} from '../common/title'
import {GamesSection} from './games-section'
import {TeamsSection} from './teams-section'
import Grid from 'material-ui/Grid'
import {BestPlayers} from './best-players'

const styles = require('./home.css')

export class Home extends React.Component<{ data: Data, stats: Stats, config: AppConfig }, {}> {
  render() {
    const {config, data, stats} = this.props
    return (
      <div className={styles.home}>
        <AppBar position='static'>
          <Toolbar>
            <MenuIconPopover data={data} />
            <Title config={config} section='Home' />
          </Toolbar>
        </AppBar>
        <div className={styles.content}>
          <Grid container spacing={24}>
            <BestPlayers data={data} stats={stats} config={config} />
            <GamesSection data={data} config={config} />
            <TeamsSection data={data} config={config} />
          </Grid>
        </div>
      </div>
    )
  }
}
