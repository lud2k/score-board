
import * as React from 'react'
import {MenuIconPopover} from '../common/menu-icon-popover'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import {Title} from '../common/title'
import {AppConfig} from '../../config'
import {Data} from '../../model/models'

const styles = require('./not-found.css')

export class NotFound extends React.Component<{ data: Data, config: AppConfig }, {}> {
  render() {
    const {data, config} = this.props
    return (
      <div>
        <AppBar position='static'>
          <Toolbar>
            <MenuIconPopover data={data} />
            <Title config={config} section='Not Found' />
          </Toolbar>
        </AppBar>
        <div className={styles.notFound}>
        Ooops! The page you are looking for does not exist.
        </div>
      </div>
    )
  }
}
