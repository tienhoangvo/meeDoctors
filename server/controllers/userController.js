import User from './../models/userModel'

import {
  listAll,
  getOne,
  createOne,
  deleteOne,
  updateOne,
} from './controllerFactory'

export const listAllUsers = listAll(User)

export const getUser = getOne(User)

export const createUser = createOne(User)

export const updateUser = updateOne(User)

export const deleteUser = deleteOne(User)
