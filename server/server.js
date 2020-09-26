import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
console.log()

dotenv.config({
  path: path.join(process.cwd(), './config.env'),
})
const { NODE_ENV, PORT, DB_URI, DB_PWD } = process.env
console.log({ NODE_ENV, PORT, DB_URI, DB_PWD })

import app from './app'
const port = PORT || 8000

const server = app.listen(port, (err) => {
  if (err) {
    console.log('Cannot sent the server', err)
  } else {
    console.log(`--APP IS LISTENING ON PORT ${port}`)
  }
})

const URI = DB_URI.replace('<DB_PWD>', DB_PWD)
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
