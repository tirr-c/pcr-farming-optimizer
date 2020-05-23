const path = require('path');

module.exports = {
  siteMetadata: {
    title: 'PriconneR Farming Optimizer',
  },
  plugins: [
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'assets',
        path: path.resolve(__dirname, 'src/assets'),
      },
    },
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
