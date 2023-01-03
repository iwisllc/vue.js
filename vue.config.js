module.exports = {
  filenameHashing: false,
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.module
      .rule('images')
      .use('url-loader')
      .tap((options) => ({ ...options, name: 'img/[name].[ext]' }));
    // config.module
    //   .rule("i18n")
    //   .resourceQuery(/blockType=i18n/)
    //   .type('javascript/auto')
    //   .use("i18n")
    //   .loader("@kazupon/vue-i18n-loader")
    //   .end();
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
  // devServer: {
  //   proxy: {
  //     '/*': {
  //       //target: 'https://pas-test.iwis.io',
  //      target: 'http://pas-dev.a.iwis.io',
  //     },
  //   },
  // },

  devServer: {
    proxy: {
      '^/api': {
        //target: 'https://pas-test.iwis.io',
        target: process.env.BASE_URL,
      },
      '^/ws': {
        target: process.env.BASE_URL,
        ws: true,
        changeOrigin: true,
        onProxyReq: function (request) {
          request.setHeader("origin", "http://192.168.1.6:8080");
        }
      },
    },
  },
};