const nodemailer = require('nodemailer')

const {
  EMAIL_FROM,
  EMAIL_SERVICE,
  EMAIL_SERVICE_USERNAME,
  EMAIL_SERVICE_PASSWORD,
} = process.env

class Email {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.firstName
    this.url = url
    this.from = EMAIL_FROM
  }

  initializeTransport() {
    return nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: EMAIL_SERVICE_USERNAME,
        pass: EMAIL_SERVICE_PASSWORD,
      },
    })
  }

  // Send email
  async send(text, subject) {
    // 1) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text,
    }

    // 2) Create a transport and send email
    const mailInfo = await this.initializeTransport().sendMail(
      mailOptions
    )
  }

  async sendWelcome() {
    await this.send(
      `Congrats you have successfully created your account.
      \nHowever, in order to use our service you need to verify your phone and email first.`,
      'Welcome to the meeDoctors family!'
    )
  }

  async sendEmailVerificationToken(token) {
    await this.send(
      `You have required to perfom an verification email.
    \nHere is your email verification token ${token}.
    \nIf you do not perform this action. Please ignore this email.`,
      'Email Verification Token'
    )
  }

  async sendPasswordReset(token) {
    await this.send(
      `You have required us to perform a perform reset password action.
      \nHere is your password reset token ${token} is hear if you do not perfom this action.
      \nPlease ignore this email`,
      'Your password reset token (valid for only 10 minutes)'
    )
  }
}

export default Email
