module.exports = {
  siteMetadata: {
    title: 'Skates & Stats',
    description: 'Hockey statistics for players and teams',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Hockey Statistics',
        short_name: 'hockeystats',
        start_url: '/',
        background_color: '#156FA4',
        theme_color: '#156FA4',
        display: 'minimal-ui',
        icon: 'graph_icon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Lato`,
            variants: [`400`, `900`],
          },
          {
            family: `Open Sans`,
            variants: [`400`],
          },
        ],
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/images/`,
      },
    },
    `gatsby-plugin-styled-components`,
  ],
  proxy: {
    prefix: '/api',
    url: 'http://localhost:5000',
  },
}
