import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide your name!'],
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'Please provide your email!'],
    unique: true,
    match: [
      /.+\@.+\..+/,
      'Please provide a valid email adresss!',
    ],
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
