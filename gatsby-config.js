const path = require('path');

module.exports = {
  siteMetadata: {
    title: '',
    description: '',
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'assets',
        path: path.resolve(__dirname, 'src/assets'),
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-typescript',
  ],
};
