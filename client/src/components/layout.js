import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import { Location } from '@reach/router'

import Header from './header'
import './layout.css'

const Layout = ({ children, data }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <Location>
        {({ location }) => {
          const full =
            location.pathname.includes('stats') || location.pathname === '/'
          return (
            <>
              <Helmet
                title={data.site.siteMetadata.title}
                meta={[
                  { name: 'description', content: 'Sample' },
                  { name: 'keywords', content: 'sample, something' },
                ]}
              >
                <html lang="en" />
              </Helmet>
              <Header siteTitle={data.site.siteMetadata.title} />
              <div
                style={{
                  margin: '0 auto',
                  maxWidth: full ? '100%' : 960,
                  padding: '1rem 1rem 1.5rem',
                }}
              >
                {children}
              </div>
            </>
          )
        }}
      </Location>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
