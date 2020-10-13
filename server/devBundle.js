import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import webpackConfig from './../webpack.config.client'
// console.log('hahaha', webpackConfig)
const compile = (app) => {
  if (process.env.NODE_ENV == 'development') {
    console.log('NODE_ENV', process.env.NODE_ENV)
    const compiler = webpack(webpackConfig)
    const middleware = webpackMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
    })

    app.use(middleware)
    app.use(webpackHotMiddleware(compiler))
  }
}

export default {
  compile,
}
