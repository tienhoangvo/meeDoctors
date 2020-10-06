import TimeSlot from './../models/timeSlotModel'
import {
  listAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} from './../controllers/controllerFactory'

export const listAllTimeSlots = listAll(TimeSlot)

export const createTimeSlot = createOne(TimeSlot)

export const getTimeSlot = getOne(TimeSlot)

export const updateTimeSlot = updateOne(TimeSlot)

export const deleteTimeSlot = deleteOne(TimeSlot)
