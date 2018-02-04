
import * as React from 'react'
import Typography from 'material-ui/Typography'
import {AppConfig} from '../../config'

export class Title extends React.Component<{ config: AppConfig, section: string, subSection?: string}, {}> {
  getTitle() {
    const {config, section, subSection} = this.props
    let title = `${config.title} | ${section}`
    if (subSection) {
      title += ` | ${subSection}`
    }
    return title
  }

  componentDidMount() {
    document.title = this.getTitle()
  }

  componentDidUpdate() {
    document.title = this.getTitle()
  }

  render() {
    return (
      <Typography type='title' color='inherit' style={{ flex: 1 }}>
        {this.getTitle()}
      </Typography>
    )
  }
}
