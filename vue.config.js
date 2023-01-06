module.exports = {
  filenameHashing: false,
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.module
      .rule('images')
      .use('url-loader')
      .tap((options) => ({ ...options, name: 'img/[name].[ext]' }));
  },
  
  transpileDependencies: ['v-calendar'],

  configureWebpack: {
    output: {
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js',
    },
    node: {
      __dirname: true,
    },
    devServer: {
        headers: { "Access-Control-Allow-Origin": "*" }
    },
    optimization: {
      runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 0,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
  
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            }
          }
        }
      }
    }
  },

  css: {
    loaderOptions: {
      sass: {
        prependData:
                    `
                      @import "~@/scss/main.scss";
                    `,
      },
    },
    extract: {
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css',
    },
    sourceMap: true,
  },
  lintOnSave: true,
  devServer: {
    proxy: {
      '^/api': {
        target: process.env.BASE_URL,
      },
    },
  },
};