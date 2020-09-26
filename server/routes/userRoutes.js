import { Router } from 'express'
import {
  listAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
} from '../controllers/userController'

import { authenticate } from './../controllers/authController'

const router = Router()

router.route('/').get(listAllUsers).post(createUser)

router
  .route('/:id')
  .get(authenticate, getUser)
  .patch(authenticate, updateUser)
  .delete(authenticate, deleteUser)

export default router
