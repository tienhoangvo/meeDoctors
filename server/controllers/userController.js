import AppError from '../utils/appError'
import catchPromises from '../utils/catchPromises'
import User from './../models/userModel'

import {
  listAll,
  getOne,
  createOne,
  deleteOne,
  updateOne,
} from './controllerFactory'

const filterObject = (obj, attributes = []) => {
  let newObj = { ...obj }
  attributes.forEach((attribute) => {
    if (newObj[attribute]) delete newObj[attribute]
  })

  return newObj
}

export const listAllUsers = listAll(User)

export const getUser = getOne(User)

export const createUser = createOne(User)

export const updateUser = updateOne(User)

export const deleteUser = catchPromises(
  async (req, res, next) => {
    const { id } = req.params

    const user = await User.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      { runValidators: true, new: true }
    )

    if (!user)
      return next(
        new AppError(
          'No user found with that given ID',
          404
        )
      )

    res.status(204).json({
      status: 'success',
      data: null,
    })
  }
)

// CURRENT USER

export const getMe = (req, res, next) => {
  console.log('AAAAAAAAAAAAAAA')
  req.params.id = req.user._id
  console.log('AAAAAAAAAAAAAAA')
  console.log(req.user)
  next()
}

export const updateMe = catchPromises(
  async (req, res, next) => {
    console.log('UPDATE ME', req.body)
    const updateObj = filterObject(req.body, [
      'role',
      'password',
      'email',
      'phone',
      'verifiedPhone',
      'verifiedEmail',
    ])

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateObj,
      {
        runValidators: true,
        new: true,
      }
    )

    if (!user)
      return next(
        new AppError(
          'No user found with that given ID',
          404
        )
      )

    res.status(200).json({
      status: 'success',
      user,
    })
  }
)
