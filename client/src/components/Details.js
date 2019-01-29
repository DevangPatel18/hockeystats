import React from 'react'
import { Link } from 'gatsby'

const Home = () => {
  const user = {}
  console.log('user:', user)
  return (
    <div>
      <h1>Profile Details</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone_number}</p>
      <p>Username: {user.username}</p>
      <Link to="/app/home">Home</Link>
    </div>
  )
}

export default Home
