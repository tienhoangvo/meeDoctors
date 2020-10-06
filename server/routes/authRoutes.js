import { Router } from 'express'
import {
  login,
  logout,
  signup,
} from '../controllers/authController'

const router = Router()

router.post('/login', login)
router.post('/signup', signup)
router.get('/logout', logout)

export default router
