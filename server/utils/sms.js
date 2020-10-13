import Twilio from 'twilio'

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
} = process.env

class SMSService {
  constructor(phoneNumber) {
    const client = Twilio(
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN
    )

    this.service = client.verify.services(
      process.env.TWILIO_PHONE_VERIFICATION_SERVICEID
    )
    this.phoneNumber = phoneNumber
  }

  async sendVerificationToken() {
    const verification = await this.service.verifications.create(
      {
        to: this.phoneNumber,
        channel: 'sms',
      }
    )

    return verification
  }

  async checkVerificationToken(token) {
    const verificationCheck = await this.service.verificationChecks.create(
      {
        to: this.phoneNumber,
        code: token,
      }
    )

    return verificationCheck
  }
}

export default SMSService
