import * as React from 'react'
import Avatar from 'material-ui/Avatar'
import * as md5 from 'blueimp-md5'
import {Player} from '../../model/models'
import * as jdenticon from 'jdenticon/dist/jdenticon.min.js'

export class PlayerAvatar extends React.Component<{ player: Player }, {}> {
  render() {
    const hash = md5(this.props.player.name)
    const src = 'data:image/svg+xml;utf8,' + jdenticon.toSvg(hash, 64)
    return (
      <Avatar style={{background: 'white', borderRadius: 0}}>
        <img className='avatar-image' src={src} />
      </Avatar>
    )
  }
}
