import React from 'react'
import { Link } from 'gatsby'
import { Button } from '@material-ui/core/'

const Home = () => (
  <div>
    <h1>Home</h1>
    <p>You are now logged in!</p>
    <Button
      component={Link}
      to="/app/profile"
      color="primary"
      variant="contained"
      size="large"
      style={{ marginTop: '1rem' }}
    >
      View profile
    </Button>
  </div>
)

export default Home
