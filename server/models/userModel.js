import { Schema, model } from 'mongoose'
import {
  isEmail,
  isMobilePhone,
  isInt,
} from 'validator'
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
  fullName: {
    type: String,
  },
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
    validate: {
      validator: (value) =>
        isEmpty(value, { ignore_whitespace: true }),
      message:
        'First Name cannot be either empty or contain only whitespaces!',
    },
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your first name'],
    validate: {
      validator: (value) =>
        isEmpty(value, { ignore_whitespace: true }),
      message:
        'First Name cannot be either empty or contain only whitespaces!',
    },
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'Please provide your email!'],
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
    required: [true, 'Pleaase provide your email'],
  },
  city: {
    type: String,
    required: [
      true,
      'In which city you currently live ?',
    ],
    lowercase: true,
    validate: {
      validator: (value) =>
        isEmpty(value, { ignore_whitespace: true }),
      message:
        'Last Name cannot be either empty or contain only whitespaces!',
    },
  },
  password: {
    type: String,
    trim: true,
    minlength: [
      6,
      'Password must be at least 6 chararacters',
    ],
    required: [true, 'Please provide your password!'],
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
  address: {
    type: String,
    trim: true,
  },
  qualifications: {
    type: [Schema.Types.ObjectId],
    ref: 'Qualifications',
  },
  yearsOfExprence: {
    type: Number,
    validate: [
      isInt,
      'Years of experience must be a positive integer ranging from 1 to 40',
    ],
  },
  specialties: {
    type: [Schema.Types.ObjectId],
    ref: 'Specialities',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
})

userSchema.pre('save', async function (next) {
  // 1) Check if password is modified
  if (!this.isModified('password')) return next()

  // 2) Hash the password if it was provided
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.pre('findOneAndUpdate', async function (
  next
) {
  console.log(this)

  // 1) Check if password is modified
  if (!this._update.password) {
    return next()
  }

  // 2) Hash the password if it was provided
  this._update.password = await bcrypt.hash(
    this._update.password,
    12
  )
  next()
})

userSchema.methods.comparePasswords = async function (
  candidatePassword
) {
  return await bcrypt.compare(
    candidatePassword,
    this.password
  )
}

export default model('User', userSchema)
