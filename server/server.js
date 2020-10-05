import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'

dotenv.config({
  path: path.join(process.cwd(), './config.env'),
})
const {
  PORT,
  DB_URI,
  DB_PASSWORD,
  DB_USERNAME,
  DB_NAME,
} = process.env

import app from './app'
const port = PORT || 8000

const server = app.listen(port, (err) => {
  if (err) {
    console.log('Cannot sent the server', err)
  } else {
    console.log(`--APP IS LISTENING ON PORT ${port}`)
  }
})

const URI = DB_URI.replace(
  '<DB_USERNAME>',
  DB_USERNAME
)
  .replace('<DB_PASSWORD>', DB_PASSWORD)
  .replace('<DB_NAME>', DB_NAME)

mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err, db) => {
    if (err) {
      console.log(
        '--💥ERROR: CANNOT CONNECT TO DATABASE',
        err
      )
    } else {
      console.log(
        '--DATABASE: CONNECTED SUCCESSFULLY!'
      )
    }
  }
)

process
  .on('unhandledRejection', (reason, p) => {
    console.error(
      reason,
      'Unhandled Rejection at Promise',
      p
    )
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown')
    process.exit(1)
  })
