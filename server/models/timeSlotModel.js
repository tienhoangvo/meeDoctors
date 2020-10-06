import { Schema, model } from 'mongoose'

const timeSlotSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      required: [
        true,
        'Timeslot must belong to a doctor!',
      ],
    },

    startingAt: {
      type: Date,
      validate: {
        validator: async function (value) {
          t
        },
      },
    },

    duration: {
      type: Number,
      min: [
        10,
        'Duration must be greater or equal to 10 minutes! ',
      ],
      max: [
        60,
        'Duration must be larger or equal to 60 minutes! ',
      ],
      default: 15,
    },
    endingAt: Date,
    price: {
      type: Number,
      required: [
        true,
        'Please provide the price for the timeslot!',
      ],
      min: [
        0,
        'Price must be greater or equal to $0! ',
      ],
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

// DOCUMENTS MIDDLEWARE
timeSlotSchema.pre('save', async function (next) {
  console.log(this)

  this.endingAt =
    this.startingAt + duration * 60 * 1000
  next()
})

timeSlotSchema.post(
  'findOneAndUpdate',
  async function (doc) {
    if (
      this.isModified('duration') ||
      this.isModified('startingAt')
    ) {
      this.endingAt = this.startingAt + this.duration
      await this.save()
    }
  }
)

timeSlotSchema.index(
  { doctor: 1, startingAt: 1, duration: 1 },
  { unique: true }
)

export default model('TimeSlot', timeSlotSchema)
