const path = require('path');

module.exports = {
  pathPrefix: '/farming-optimizer',
  siteMetadata: {
    title: 'PriconneR Farming Optimizer',
    availableRegions: [
      { region: 'jp', locale: 'en' },
      { region: 'kr', locale: 'ko' },
    ],
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
    {
      resolve: 'gatsby-plugin-offline',
      options: {
        workboxConfig: {
          runtimeCaching: [
            {
              urlPattern: /(\.js$|\.css$|static\/)/,
              handler: 'CacheFirst',
            },
            {
              urlPattern: /\/data\//,
              handler: 'StaleWhileRevalidate',
            },
            {
              urlPattern: /^https?:.*\/page-data\/.*\/page-data\.json/,
              handler: 'NetworkFirst',
            },
            {
              urlPattern: /^https:\/\/(?:ames-static|pcrdb)\.tirr\.dev\/icons\//,
              handler: 'CacheFirst',
              options: {
                cacheName: 'icons',
                expiration: {
                  maxAgeSeconds: 1209600,
                },
              },
            },
            {
              urlPattern: /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
              handler: 'StaleWhileRevalidate',
            },
          ],
        },
      },
    },
    {
      resolve: 'gatsby-plugin-intl',
      options: {
        path: path.resolve(__dirname, 'src/intl'),
        languages: ['en', 'ko'],
        defaultLanguage: 'ko',
        redirect: true,
      },
    },
  ],
};
