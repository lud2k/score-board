
import * as React from 'react'
import Button from 'material-ui/Button'
import {AppConfig} from '../../config'
import AddCircleOutlineIcon from 'material-ui-icons/AddCircleOutline'
import {CircularProgress} from 'material-ui/Progress'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/Menu/MenuItem'
import Dialog, {DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog'
import _ = require('lodash')
import {Game, Id, Score, Data} from '../../model/models'
import {PlayerSelectField} from '../../page/common/player-select-field'
import {FormLabel} from 'material-ui/Form'
import {addScore} from '../../redux/actions'
import {store} from '../../redux/store'
import moment = require('moment')

const styles = require('./add-score.css')

export class AddScore extends React.Component<{data: Data, config: AppConfig}, {open: boolean,
  gameId?: Id, playerId1?: Id, playerId2?: Id, scores: {score1: string, score2: string}[],
  loading: boolean, date: string}> {

  constructor(props: any) {
    super(props)

    // Restore last selected values
    const gameId = window.localStorage.getItem('gameId')
    const playerId1 = window.localStorage.getItem('playerId1')
    const playerId2 = window.localStorage.getItem('playerId2')

    this.state = {
      date: moment().format('YYYY-MM-DD'),
      open: false,
      loading: false,
      gameId: gameId || '',
      playerId1: playerId1 || '',
      playerId2: playerId2 || '',
      scores: [{score1: '', score2: ''}],
    }
  }

  isScoresFilled(): boolean {
    let allFilled = true
    const scores = this.state.scores
    scores.forEach((score, index) => {
      if (index === 0 || index < scores.length-1) {
        allFilled = allFilled && !!score.score1 && !!score.score2
      }
    })
    return allFilled
  }

  isAllFilled(): boolean {
    return this.state.gameId !== '' && this.state.playerId1 !== '' && this.state.playerId2 !== '' &&
      this.isScoresFilled() && this.state.playerId1 !== this.state.playerId2
  }

  onClickAdd = () => {
    this.setState({
      open: true,
      scores: [{score1: '', score2: ''}],
      date: moment().format('YYYY-MM-DD'),
    })
  }

  onClose = () => {
    this.setState({ open: false })
  }

  onClickAddScore = () => {
    // show loading
    this.setState({ loading: true })

    // do ajax request
    const scores: Promise<void>[] = this.state.scores
      .filter((score) => {
        // only keep scores that are valid
        return score.score1 && score.score2 && !(score.score1 === '0' && score.score2 === '0')
      })
      .map((score) => {
        return fetch(`${this.props.config.backend.url}/scoresx`, {
          method: 'POST',
          body: JSON.stringify({
            date: this.state.date,
            gameId: this.state.gameId,
            playerId1: this.state.playerId1,
            playerId2: this.state.playerId2,
            score1: parseInt(score.score1, 10),
            score2: parseInt(score.score2, 10),
          }),
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        }).then((response: any) => {
          if (response.status !== 200) {
            throw new Error('Invalid response: ' + response.statusText)
          }

          return response.json().then((newScore: Score) => {
            store.dispatch(addScore(newScore))
          })
        })
      })
    Promise.all(scores).then(() => {
      this.setState({ open: false, loading: false })
    }).catch(() => {
      alert('Oooops. A score failed to be added.')
      this.setState({ loading: false })
    })
  }

  onChangeGame = (event: any) => {
    const gameId = event.currentTarget.value+''
    this.setState({ gameId })
    window.localStorage.setItem('gameId', gameId)
  }

  onChangeDate = (event: any) => {
    const date = event.currentTarget.value+''
    this.setState({ date })
  }

  onChangeScore = (name: string, index: number) => (event: any) => {
    const scores: any = this.state.scores
    if (!scores[index]) {
      scores[index] = { score1: '', score2: '' }
    }
    scores[index][name] = event.currentTarget.value+''

    // is it not the last row and it is now empty?
    if (scores.length-1 !== index && !scores[index].score1 && !scores[index].score2) {
      scores.splice(index, 1)
    }

    // is it the last row and it is completely filled?
    const score = scores[index]
    if (scores.length-1 === index && score.score1 && score.score2) {
      scores[index+1] = { score1: '', score2: '' }
    }

    this.setState({ scores })
  }

  onChangePlayer = (name: string) => (playerId: Id) => {
    this.setState({ [name]: playerId } as any)
    window.localStorage.setItem(name, playerId)
  }

  renderScoreInputs() {
    const scores = this.state.scores
    return scores.map((score, index) => (
      <div className={styles.group}>
        <TextField margin='dense' label='Score' type='number' fullWidth key={index}
                   value={scores[index][`score1`]} onChange={this.onChangeScore(`score1`, index)} />
        <TextField margin='dense' label='Score' type='number' fullWidth key={index}
                   value={scores[index][`score2`]} onChange={this.onChangeScore(`score2`, index)} />
      </div>
    ))
  }

  render() {
    const {open, gameId, date, playerId1, playerId2, loading} = this.state
    return (
      <div>
        <Button color='contrast' onClick={this.onClickAdd}>
          <AddCircleOutlineIcon />&nbsp;
          Add Score
        </Button>
        <Dialog open={open} onClose={this.onClose} classes={{paper: styles.dialog}}>
          <DialogTitle>Add Score</DialogTitle>
          <DialogContent>
            <TextField label='Date' type='date' value={date} onChange={this.onChangeDate}
                       fullWidth className={styles.dateField} />
            <TextField select label='Game' fullWidth value={gameId} onChange={this.onChangeGame}>
              {_.sortBy(_.values(this.props.data.games), 'name').map((game: Game) => (
                <MenuItem key={game.id} value={game.id}>
                  {game.name}
                </MenuItem>
              ))}
            </TextField>
            <div>
              <div className={styles.group}>
                <FormLabel component='legend'>Player 1</FormLabel>
                <FormLabel component='legend'>Player 2</FormLabel>
              </div>
              <div className={styles.group}>
                <PlayerSelectField players={this.props.data.players} value={playerId1}
                                   label='Name' onChange={this.onChangePlayer('playerId1')} />
                <PlayerSelectField players={this.props.data.players} value={playerId2}
                                   label='Name' onChange={this.onChangePlayer('playerId2')} />
              </div>
              {this.renderScoreInputs()}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.onClickAddScore} color='primary'
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
