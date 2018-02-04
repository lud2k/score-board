
import * as React from 'react'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'

const styles = require('./fact.css')

export class Fact extends React.Component<{}, {}> {
  render() {
    return (
      <Grid item xs={12} sm={4}>
        <Paper className={styles.paper}>
          <div className={styles.fact}>
            {this.props.children}
          </div>
        </Paper>
      </Grid>
    )
  }
}
