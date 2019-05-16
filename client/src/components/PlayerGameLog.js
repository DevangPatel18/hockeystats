import React, { Component } from 'react'
import { AppBar, IconButton, Toolbar } from '@material-ui/core/'
import CloseIcon from '@material-ui/icons/Close'
import { yearFormatter } from '../helper/columnLabels'

class PlayerGameLog extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { onClose, playerObj } = this.props

    return (
      <div>
        <AppBar position="static">
          <Toolbar style={{ position: 'relative' }}>
            <IconButton
              color="inherit"
              onClick={onClose}
              aria-label="Close"
              style={{ position: 'absolute' }}
            >
              <CloseIcon />
            </IconButton>
            <div style={{ margin: '0 auto' }}>
              {playerObj.playerName} ({yearFormatter(playerObj.seasonId)})
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default PlayerGameLog
