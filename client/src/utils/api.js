import axios from 'axios'

export default axios.create({
  ...(process.env.NODE_ENV === 'production' && {
    baseURL: process.env.GATSBY_PROXY_URL,
  }),
})
