import { Schema, model } from 'mongoose'

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [
        true,
        'Message must belong a sender!',
      ],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Message must has a reciever'],
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: [
        true,
        'Message must belong to a booking',
      ],
    },
    content: {
      type: String,
      required: [true, 'Message must has content!'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
)

messageSchema.index(
  {
    sender: 1,
    receiver: 1,
    booking: 1,
    createdAt: 1,
  },
  { unique: true }
)

export default model('Message', messageSchema)
