import { Router } from 'express'
import {
  authenticate,
  getPhoneVerificationCode,
  verifyPhone,
  getEmailVerificationCode,
  verifyEmail,
  changePassword,
  changeEmail,
  changePhone,
  forgotPassword,
  resetPassword,
  login,
  logout,
  signup,
} from '../controllers/authController'

const router = Router()

////////////////////////
// AUTHENTICATION
////////////////////////
router.post('/login', login)
router.post('/signup', signup)
router.get('/logout', logout)

//////////////////////////////
// CHANGE USER'S CREDENTIALS
/////////////////////////////
router.patch(
  '/change-password',
  authenticate,
  changePassword
)
router.patch(
  '/change-email',
  authenticate,
  changeEmail
)
router.patch(
  '/change-phone',
  authenticate,
  changePhone
)

///////////////////////////
// VERIFICATION METHODS
//////////////////////////
router.get(
  '/get-phone-verification-code',
  authenticate,
  getPhoneVerificationCode
)
router.post('/verify-phone', authenticate, verifyPhone)
router.get(
  '/get-email-verification-code',
  authenticate,
  getEmailVerificationCode
)
router.post('/verify-email', authenticate, verifyEmail)

//////////////////////////////
// RESET AND FORGOT PASSWORD
/////////////////////////////
router.post('/forgot-password', forgotPassword)
router.patch(
  '/reset-password/:resetPasswordToken',
  resetPassword
)

export default router
