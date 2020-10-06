import { Router } from 'express'

import {
  listAllTimeSlots,
  createTimeSlot,
  getTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
} from './../controllers/timeSlotController'

const router = Router({ mergeParams: true })

router
  .route('/')
  .get(listAllTimeSlots)
  .post(createTimeSlot)

router
  .route('/:id')
  .get(getTimeSlot)
  .patch(updateTimeSlot)
  .delete(deleteTimeSlot)

export default router
