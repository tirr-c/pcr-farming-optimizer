const path = require('path');

module.exports = {
  pathPrefix: '/farming-optimizer',
  siteMetadata: {
    title: 'PriconneR Farming Optimizer',
  },
  plugins: [
    'gatsby-plugin-sass',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-astroturf',
      options: {
        extension: '.module.scss',
      },
    },
  ],
};
