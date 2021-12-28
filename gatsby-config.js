module.exports = {
  siteMetadata: {
    siteUrl: "https://pase-barrani.vercel.app",
    title: "Pase Barrani",
  },
  plugins: [
    "gatsby-plugin-emotion",
    "gatsby-plugin-use-query-params",
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `open sans\:700` // you can also specify font weights and styles
        ],
        display: 'swap'
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: './src/images/icon.png',
        name: 'MiArgentina',
        background_color: '#fff',
        display: `standalone`,
      }
    }
  ],
};
