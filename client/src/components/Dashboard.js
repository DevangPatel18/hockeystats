import React, { Component } from 'react'
import { Link } from 'gatsby'

class Dashboard extends Component {
  render() {
    return (
      <div>
        Dashboard
        <div>
          <Link to="/">
            <span
              style={{
                marginTop: '1rem',
              }}
            >
              Back to Home
            </span>
          </Link>
        </div>
      </div>
    )
  }
}

export default Dashboard
