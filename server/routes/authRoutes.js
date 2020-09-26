import { Router } from 'express'
import {
  login,
  authenticate,
  logout,
} from '../controllers/authController'

const router = Router()

router.post('/login', login)
router.get('/logout', authenticate, logout)

export default router
