import { Schema, model } from 'mongoose'

const bookingSchema = new Schema(
  {
    timeSlot: {
      type: Schema.Types.ObjectId,
      ref: 'TimeSlot',
      required: [
        true,
        'Booking must belong to a timeslot.',
      ],
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [
        true,
        'Booking must belong to a user',
      ],
    },
    duration: Number,
    status: {
      type: String,
      enum: {
        values: ['completed', 'pending'],
        message:
          'Status is either completed or pending',
      },
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

bookingSchema.index(
  { timeSlot: 1, customer: 1 },
  { unique: true }
)

export default model('Booking', bookingSchema)
