import express from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import {
  ServerStyleSheets,
  ThemeProvider,
} from '@material-ui/core/styles'
import theme from './../client/theme'

import MainRouter from './../client/MainRouter'
import Template from '../Template'
import globalErrorHandler from './controllers/errorHandler'
import devBundle from './devBundle'
import userRouter from './routes/userRoutes'
import authRouter from './routes/authRoutes'
import { isLoggedIn } from './controllers/authController'

const app = express()

devBundle.compile(app)
const CURRENT_WORKING_DIR = process.cwd()

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compression())

app.use(cors())
app.options('*', cors())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      scriptSrcAttr: ['none'],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", "https: 'unsafe-inline'"],
      fontSrc: ["'self'", "https: 'unsafe-inline'"],
    },
  })
)
app.use(helmet.dnsPrefetchControl())
app.use(helmet.expectCt())
app.use(helmet.frameguard())
app.use(helmet.hidePoweredBy())
app.use(helmet.hsts())
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.permittedCrossDomainPolicies())
app.use(helmet.referrerPolicy())
app.use(helmet.xssFilter())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(
  '/dist',
  express.static(
    path.join(CURRENT_WORKING_DIR, 'dist')
  )
)
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)

// app.get('/', (req, res) => {
//   res.status(200).send(Template())
// })

app.get('*', isLoggedIn, (req, res) => {
  const sheets = new ServerStyleSheets()
  const context = {}

  const markup = ReactDOMServer.renderToString(
    sheets.collect(
      <StaticRouter
        location={req.url}
        context={context}
      >
        <ThemeProvider theme={theme}>
          <MainRouter user={req.user} />
        </ThemeProvider>
      </StaticRouter>
    )
  )

  if (context.url) {
    return res.redirect(303, context.url)
  }
  const css = sheets.toString()
  res.status(200).send(
    Template({
      markup: markup,
      css: css,
    })
  )
})

app.use(globalErrorHandler)

export default app
