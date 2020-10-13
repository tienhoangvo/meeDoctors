import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import User from './../models/userModel'
import catchPromises from './../utils/catchPromises'
import AppError from '../utils/appError'

import SMSService from './../utils/sms'
import Email from './../utils/email'

const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN,
  JWT_EMAIL_EXPIRES_IN,
} = process.env

///////////////////////////////
// FUNCTIONS
///////////////////////////////
const logUserIn = (res, statusCode, user) => {
  const token = jwt.sign(
    { _id: user._id },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  )

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge:
      JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  })

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  })
}

///////////////////////////////
// AUTHENTICATION
///////////////////////////////
export const logout = catchPromises(
  (req, res, next) => {
    res.cookie('jwt', 'loggedout', {
      httpOnly: true,
      maxAge: 1000,
    })

    res.status(200).json({
      status: 'success',
    })
  }
)

export const signup = catchPromises(
  async (req, res, next) => {
    const {
      phone,
      password,
      passwordConfirm,
      email,
      firstName,
      lastName,
      city,
      address,
      sex,
    } = req.body

    const user = await User.create({
      phone,
      password,
      passwordConfirm,
      email,
      firstName,
      lastName,
      city,
      address,
      sex,
    })

    await new Email(user).sendWelcome()

    logUserIn(res, 201, user)
  }
)

export const login = catchPromises(
  async (req, res, next) => {
    const user = await User.findOne({
      phone: req.body.phone,
    }).select('+password')

    if (
      !user ||
      !(await user.comparePasswords(req.body.password))
    )
      return next(
        new AppError('Invalid phone or password', 403)
      )

    logUserIn(res, 200, user)
  }
)

export const isLoggedIn = catchPromises(
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
      JWT_SECRET,
      {
        maxAge: JWT_EXPIRES_IN,
      }
    )

    const user = await User.findById(decoded._id)

    req.user = user

    next()
  }
)

export const authenticate = catchPromises(
  async (req, res, next) => {
    // 01 -- Retrieve token from the request header
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

    // 02 -- Verify and decode the token.
    const decoded = await jwt.verify(
      token,
      JWT_SECRET,
      {
        maxAge: JWT_EXPIRES_IN,
      }
    )

    // 03 -- Lookup the user with the id decoded from the token
    const user = await User.findById(decoded._id)

    if (!user) {
      return next(
        new AppError(
          'User belongs to this token has been deleted!',
          401
        )
      )
    }

    // 04 -- Check if the user has changed his/her password after the token initialized!
    if (user.changedPasswordAfter(decoded.iat))
      return next(
        new AppError(
          'User has changed the password! Please log in again',
          401
        )
      )

    // 05 -- Allow user the access the protected route
    req.user = user
    next()
  }
)

///////////////////////////////
// AUTHORIZATION
///////////////////////////////
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    const user = { req }
    // Check if user's role is in the allowed roles that specified before.
    if (!roles.includes(user.role)) {
      return next(
        new AppError(
          `You do not have persmission to access this URL: ${req.orignalURL}.`,
          403
        )
      )
    }

    next()
  }
}

///////////////////////////////
// VERIFICATIONS
///////////////////////////////
export const requirePhoneVerified = (
  req,
  res,
  next
) => {
  // Retrieve current user
  const { user } = req

  //01 -- Check if he/she has verified his/her current phone or not
  if (!user.verifiedPhone) {
    return next(
      new AppError(
        `You have not verified this phone number: ${user.phone}`,
        401
      )
    )
  }
  next()
}

export const requireEmailVerified = (
  req,
  res,
  next
) => {
  // Retrieve current user
  const { user } = req

  //01 -- Check if he/she has verified his/her current email or not
  if (!user.verifiedPhone) {
    return next(
      new AppError(
        `You have not verified this email adress: ${user.email}`,
        401
      )
    )
  }

  next()
}

export const getPhoneVerificationCode = catchPromises(
  async (req, res, next) => {
    // 01 -- Get phone number
    const { phone } = req.user

    // 02 -- Connect to Twilio SMS Phone Verification Service
    const PhoneVerificationService = new SMSService(
      phone
    )

    // 03 -- Send Verification Token to user
    try {
      var verification = await PhoneVerificationService.sendVerificationToken()
    } catch (error) {
      console.log(error)
      return next(
        new AppError(
          `Cannot send SMS verification token to this number: ${phone}. Please check if your number again and resend the code if you want.`,
          400
        )
      )
    }

    res.status(200).json({
      status: 'success',
      message:
        'We sent a phone verification code to your phone! Remember the code is only valid for 10 minutes.',
      verification,
    })
  }
)

export const verifyPhone = catchPromises(
  async (req, res, next) => {
    // 1 -- Get verification code from user
    const { phoneVerificationToken } = req.body
    const { phone } = req.user

    // 02 -- Connect to Twilio SMS Phone Verification Service

    const PhoneVerificationService = new SMSService(
      phone
    )

    // 03 -- Verifiy User Phone Code
    var verificationCheck = await PhoneVerificationService.checkVerificationToken(
      phoneVerificationToken
    )

    console.log(verificationCheck)

    if (verificationCheck.status === 'pending')
      return next(
        new AppError(
          'Incorrect code. Please check it out carefully.',
          400
        )
      )

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        verifiedPhone: true,
      },
      {
        new: true,
      }
    )
    res.status(200).json({
      status: 'success',
      message: 'Your phone verified successfully.',
      user,
    })
  }
)

export const getEmailVerificationCode = catchPromises(
  async (req, res, next) => {
    const { email } = req.user

    const token = jwt.sign({ email }, JWT_SECRET, {
      expiresIn: JWT_EMAIL_EXPIRES_IN,
    })

    const EmailService = new Email(
      req.user,
      'http://127.0.0.1:3000/verify-email'
    )

    await EmailService.sendEmailVerificationToken(
      token
    )

    res.status(200).json({
      status: 'success',
      message: `We sent a verification token to this email address ${email}. Remember the code is only valid for 10 minutes.`,
    })
  }
)

export const verifyEmail = catchPromises(
  async (req, res, next) => {
    // 01 -- Get the email verification code from request body and the current user email
    const { emailVerificationToken } = req.body
    const { email } = req.user

    // 02 -- Decode the email verification token and retrieve the email
    try {
      var candidateEmail = await jwt.decode(
        emailVerificationToken,
        JWT_SECRET
      ).email
    } catch (err) {
      console.log(err)
      return next(
        new AppError(
          'Invalid code. Please check it out carefully',
          400
        )
      )
    }

    // 03 -- Check if the emails are the same
    if (candidateEmail !== email)
      return next(
        new AppError(
          'Incorrect code. Please check it out carefully.',
          400
        )
      )

    // 04 -- Update verifiedEmail field value from false to true
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        verifiedEmail: true,
      },
      {
        new: true,
      }
    )

    // 05 -- Response
    res.status(200).json({
      status: 'success',
      message: `Your email verified successfully!`,
      user,
    })
  }
)

///////////////////////////////
// CRENDENTIAL UPDATES
///////////////////////////////
export const changePassword = catchPromises(
  async (req, res, next) => {
    const {
      currentPassword,
      password,
      passwordConfirm,
    } = req.body

    // 01 -- Retrieve the current user
    const user = await User.findById(
      req.user._id
    ).select('+password')

    // 02 -- Check if the current password is correct
    if (
      !(await user.comparePasswords(currentPassword))
    )
      return next(
        new AppError(
          'Current password is not correct!',
          400
        )
      )

    // 03 -- Update passwords

    user.password = password
    user.passwordConfirm = passwordConfirm

    await user.save()

    // 04 -- Send login token
    logUserIn(res, 200, user)
  }
)

export const changeEmail = catchPromises(
  async (req, res, next) => {
    const { currentPassword, email } = req.body

    // 01 -- Retrieve the current user
    const user = await User.findById(
      req.user._id
    ).select('+password')

    // 02 -- Check if the current password is correct
    if (
      !(await user.comparePasswords(currentPassword))
    )
      return next(
        new AppError(
          'Current password is not correct!',
          400
        )
      )

    // 03 -- Update email
    user.email = email
    user.verifiedEmail = false

    await user.save()

    // 04 -- Return the updated user
    res.status(200).json({
      status: 'success',
      user,
    })
  }
)

export const changePhone = catchPromises(
  async (req, res, next) => {
    const { currentPassword, phone } = req.body

    // 01 -- Retrieve the current user
    const user = await User.findById(
      req.user._id
    ).select('+password')

    // 02 -- Check if the current password is correct
    if (
      !(await user.comparePasswords(currentPassword))
    )
      return next(
        new AppError(
          'Current password is not correct!',
          400
        )
      )

    // 03 -- Update phone
    user.phone = phome
    user.verifiedPhone = false

    await user.save()

    // 04 -- Return the updated user
    res.status(200).json({
      status: 'success',
      user,
    })
  }
)

///////////////////////////////
// FORGOT AND RESET PASSWORD
///////////////////////////////
export const forgotPassword = catchPromises(
  async (req, res, next) => {
    // 01 -- Retrieve user's email from the request body
    console.log(req.body)
    const { email } = req.body

    // 02 -- Check if there is a user with that given email
    const user = await User.findOne({ email })
    if (!user)
      return next(
        new AppError(
          `There is no user with that given email: ${email}`,
          400
        )
      )

    // 02 -- Generate the reset token
    const resetPasswordToken = await user.createResetPasswordToken()

    // 03 -- Send the reset token via email
    const resetPasswordUrl = `${req.protocol}://${req.hostname}/api/v1/reset-password/${resetPasswordToken}`
    const RestPasswordEmailService = new Email(
      user,
      resetPasswordUrl
    )

    try {
      await RestPasswordEmailService.sendPasswordReset(
        resetPasswordToken
      )
    } catch (error) {
      user.hashedResetPasswordToken = undefined
      user.resetPasswordTokenExpiresAt = undefined
      await user.save()

      console.log(error)

      return next(
        new AppError(
          'We cannot send email verification token right now! Try it later!',
          500
        )
      )
    }

    res.status(200).json({
      status: 'success',
      message: `We sent a reset password token to this email ${user.email}. Please check it out.`,
    })
  }
)

export const resetPassword = catchPromises(
  async (req, res, next) => {
    // 01 -- Retrieve the resetToken from the request params, the passwords from the request's body
    const { resetPasswordToken } = req.params
    const { password, passwordConfirm } = req.body

    // 02 -- Verify the reset token
    const hashedResetPasswordToken = crypto
      .createHash('sha256')
      .update(resetPasswordToken)
      .digest('hex')

    console.log(hashedResetPasswordToken)

    const user = await User.findOne({
      hashedResetPasswordToken,
      resetPasswordTokenExpiresAt: {
        $gt: new Date(),
      },
    })

    if (!user) {
      return next(
        new AppError(
          'The reset password token has been expired or the user belongs to it no longer exists!',
          400
        )
      )
    }

    // 03 -- Reset the passwords
    user.password = password
    user.passwordConfirm = passwordConfirm
    user.hashedResetPasswordToken = undefined
    user.resetPasswordTokenExpiresAt = undefined
    await user.save()

    // 04 -- Log user in
    logUserIn(res, 200, user)
  }
)
