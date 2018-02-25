
import * as React from 'react'
import Button from 'material-ui/Button'
import {CircularProgress} from 'material-ui/Progress'
import {AppConfig} from '../../config'
import PeopleIcon from 'material-ui-icons/People'
import TextField from 'material-ui/TextField'
import Dialog, {DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog'
import {store} from '../../redux/store'
import {addPlayer} from '../../redux/actions'
import {Player, Data} from '../../model/models'

const styles = require('./add-player.css')

export class AddPlayer extends React.Component<{data: Data, config: AppConfig},
  {open: boolean, loading: boolean, name: string}> {

  constructor(props: any) {
    super(props)

    this.state = {
      open: false,
      loading: false,
      name: '',
    }
  }

  isAllFilled(): boolean {
    return this.state.name !== ''
  }

  onClose = () => {
    this.setState({ open: false })
  }

  onClickAddPlayer = () => {
    // show loading
    this.setState({ loading: true })

    // do ajax request
    return fetch(`${this.props.config.backend.url}/players`, {
      method: 'POST',
      body: JSON.stringify({
        name: this.state.name,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response: Response) => {
      if (response.status !== 200) {
        throw new Error('Invalid response: ' + response.statusText)
      }

      // parse and trigger redux action
      return response.json().then((player: Player) => {
        this.setState({ loading: false, open: false })
        store.dispatch(addPlayer(player))
      })
    }).catch(() => {
      // show error
      alert('Oooops. User creation has failed.')
      return this.setState({ loading: false })
    })
  }

  onChangeName = (event: any) => {
    this.setState({ name: event.currentTarget.value+'' })
  }

  onClickAdd = () => {
    this.setState({ open: true, name: '' })
  }

  render() {
    const {open, name, loading} = this.state
    return (
      <div>
        <Button color='contrast' onClick={this.onClickAdd}>
          <PeopleIcon />&nbsp;
          Add Player
        </Button>
        <Dialog open={open} onClose={this.onClose} classes={{paper: styles.dialog}}>
          <DialogTitle>Add Player</DialogTitle>
          <DialogContent>
            <TextField label='Name' fullWidth value={name} onChange={this.onChangeName} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.onClickAddPlayer} color='primary'
                    disabled={!this.isAllFilled() || loading}>
              {loading && <CircularProgress size={20} className={styles.progress} />}
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
