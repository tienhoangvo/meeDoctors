import { Schema, model } from 'mongoose'
import {
  isEmail,
  isMobilePhone,
  isEmpty,
} from 'validator'

import bcrypt from 'bcryptjs'

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [
        true,
        'Please provide your first name',
      ],
      validate: {
        validator: (value) =>
          !isEmpty(value, { ignore_whitespace: true }),
        message:
          'First Name cannot be either empty or contain only whitespaces!',
      },
    },
    lastName: {
      type: String,
      required: [
        true,
        'Please provide your first name',
      ],
      validate: {
        validator: (value) =>
          !isEmpty(value, { ignore_whitespace: true }),
        message:
          'Last Name cannot be either empty or contain only whitespaces!',
      },
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Please provide your email!'],
      lowercase: true,
      unique: true,
      validate: {
        validator: isEmail,
        message: 'Your email provided is invalid!',
      },
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      validate: {
        validator: (value) => {
          return isMobilePhone(value, 'vi-VN')
        },
        message: 'Please provide a phone',
      },
    },
    sex: {
      type: String,
      trim: true,
      enum: ['male', 'female', 'secrete'],
      required: [true, 'Please provide your email'],
    },
    city: {
      type: String,
      required: [
        true,
        'In which city you currently live ?',
      ],
      validate: {
        validator: (value) => {
          return !isEmpty(value, {
            ignore_whitespace: true,
          })
        },
        message:
          'City cannot be either empty or contain only whitespaces!',
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: [
        6,
        'Password must be at least 6 chararacters',
      ],
      required: [
        true,
        'Please provide your password!',
      ],
    },
    passwordConfirm: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return this.password === value
        },
        message: 'Passwords are not the same!',
      },
    },
    forgotPasswordToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ['customer', 'administator', 'doctor'],
      default: 'customer',
    },
    verfiedEmail: {
      type: Boolean,
      default: false,
    },
    verifedPhone: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
      trim: true,
    },
    doctorDetails: Object,
    patientDetails: Object,
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

userSchema.pre('save', async function (next) {
  // I) Generate fullName
  this.fullName = this.firstName + ' ' + this.lastName

  // II) Hasing password
  // II.1) Check if password is modified
  if (!this.isModified('password')) return next()

  // II.2) Hash the password if it was provided
  this.password = await bcrypt.hash(this.password, 12)

  // II.3) Delete the passwordConfirm field
  this.passwordConfirm = undefined
  next()
})

userSchema.pre(/find/, function (next) {
  // Prevent responsing the password attribute and unnessary attributes
  this.select('-password -__v')
  next()
})

userSchema.pre('findOneAndUpdate', async function (
  next
) {
  console.log(this)

  if (Object.keys(this.getUpdate()).length == 0)
    return next()

  this.set({ updatedAt: Date.now() })

  next()
})

userSchema.virtual('fullName').get(function () {
  // Generating fullName after retrieve the user from the database.
  return `${this.firstName} ${this.lastName}`
})

userSchema.methods.comparePasswords = async function (
  candidatePassword
) {
  return await bcrypt.compare(
    candidatePassword,
    this.password
  )
}

// Create index text search
userSchema.index({
  fullName: 'text',
  phone: 'text',
  email: 'text',
})
export default model('User', userSchema)
