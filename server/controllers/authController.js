import jwt from 'jsonwebtoken'

import User from './../models/userModel'
import catchPromises from './../utils/catchPromises'
import AppError from '../utils/appError'

const logout = catchPromises((req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    httpOnly: true,
    maxAge: 1000,
  })

  res.status(200).json({
    status: 'success',
  })
})

const login = async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  })
  if (
    !user ||
    !(await user.comparePasswords(req.body.password))
  )
    return next(
      new AppError('Invalid email or password', 403)
    )

  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  )
  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge:
      process.env.JWT_COOKIE_EXPIRES_IN *
      24 *
      60 *
      60 *
      1000,
  })

  res.status(200).json({
    status: 'success',
    token,
    user,
  })
}

const isLoggedIn = catchPromises(
  async (req, res, next) => {
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt
    }

    if (!token) {
      return next()
    }
    const decoded = await jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        maxAge: process.env.JWT_EXPIRES_IN,
      }
    )

    const user = await User.findById(decoded._id)

    req.user = user

    next()
  }
)

const authenticate = catchPromises(
  async (req, res, next) => {
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt
    }

    if (!token) {
      return next(
        new AppError('You are not logged in!', 401)
      )
    }
    const decoded = await jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        maxAge: process.env.JWT_EXPIRES_IN,
      }
    )

    const user = await User.findById(decoded._id)

    if (!user) {
      return next(
        new AppError(
          'User belongs to this token has been deleted!',
          404
        )
      )
    }

    req.user = user
    next()
  }
)

export { logout, login, authenticate, isLoggedIn }
