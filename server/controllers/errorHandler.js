import AppError from './../utils/appError'

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`

  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
  const value = JSON.stringify(err.keyValue)
  const message = `Duplicated field value: ${value}. Please use another value!`

  return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(
    (el) => el.message
  )
  const message = `Invalid input data: ${errors.join(
    '; '
  )}`

  return new AppError(message, 400)
}

const handleJWTError = () =>
  new AppError(
    'Invalid token. Please log in again',
    401
  )

const handleJWTExpiredError = () =>
  new AppError(
    'Your token has expired! Please log in again',
    401
  )
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const sendErrorProd = (err, res) => {
  // OPERATIONAL, TRUSTED ERRORS
  console.log(err.message)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })

    //PROGRAMMING OR OTHER UNKNOWN ERRORS: DON'T LEAK OTHER DETAILS
  } else {
    // 1) Log error
    console.error('ERROR 💥', err)

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    })
  }
}

const golbalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  if (process.env.NODE_ENV === 'development') {
    // if (err.statusCode == 500) console.log(err);
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err)
    if (error.name === 'CastError')
      error = handleCastErrorDB(error)
    if (error.code === 11000)
      error = handleDuplicateFieldsDB(error)
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error)
    if (error.name === 'JsonWebTokenError')
      error = handleJWTError()
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError()
    }
    sendErrorProd(error, res)
  }
}

export default golbalErrorHandler
