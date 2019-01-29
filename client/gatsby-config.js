module.exports = {
  siteMetadata: {
    title: 'Hockey Stats',
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
        // icon: '', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-offline',
  ],
}
