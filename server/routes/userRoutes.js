import { Router } from 'express'
import timeSlotRouter from './timeSlotRoutes'
import {
  listAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
  getMe,
  updateMe,
} from '../controllers/userController'

import {
  authenticate,
  restrictTo,
} from './../controllers/authController'

const router = Router()

router
  .route('/me')
  .get(authenticate, getMe, getUser)
  .patch(authenticate, updateMe)
  .delete(authenticate, getMe, deleteUser)

router.route('/').get(listAllUsers).post(createUser)

router.use('/:id/timeSlots', timeSlotRouter)

router
  .route('/:id')
  .get(authenticate, getUser)
  .patch(authenticate, updateUser)
  .delete(authenticate, deleteUser)

export default router
