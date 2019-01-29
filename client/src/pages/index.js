import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'

const IndexPage = () => (
  <Layout>
    <h1>Hi people</h1>
    <p>
      Create a new account: <Link to="/app/signup">Sign Up</Link>
    </p>
    <Link to="/app/login">Sign In</Link>
    <br />
    <Link to="/app/home">Home</Link>
    <br />
    <Link to="/app/profile">Your profile</Link>
  </Layout>
)

export default IndexPage
