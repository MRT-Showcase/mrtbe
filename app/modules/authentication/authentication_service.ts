import User from '#models/user'
import NotFoundErrorException from '#exceptions/not_found_error_exception'
import BadRequestErrorException from '#exceptions/bad_request_error_exception'
import { cuid } from '@adonisjs/core/helpers'

export default class AuthenticationService {
  async validatePhoneNumber({ phoneNumber }: { phoneNumber: string }): Promise<User> {
    let user = await User.findBy('phoneNumber', phoneNumber)
    if (!user) {
      throw new NotFoundErrorException('User not found')
    }
    return user
  }

  async registerPhoneNumber({
    phoneNumber,
    pin,
  }: {
    phoneNumber: string
    pin: string
  }): Promise<User> {
    let user = await User.findBy('phoneNumber', phoneNumber)
    if (user) {
      throw new BadRequestErrorException('User already exists')
    }
    let id = cuid()
    let newUser = new User()
    newUser.id = id
    newUser.phoneNumber = phoneNumber
    newUser.pin = pin
    await newUser.save()
    return newUser
  }

  async login({ phoneNumber, pin }: { phoneNumber: string; pin: string }) {
    try {
      let user = await User.verifyCredentials(phoneNumber, pin)
      return user
    } catch (error) {
      throw new BadRequestErrorException('Invalid credentials')
    }
  }

  async getUser({ userId }: { userId: string }) {
    let user = await User.find(userId)
    if (!user) {
      throw new NotFoundErrorException('User not found')
    }
    return user
  }

  async loginWithGoogle({ firebaseId }: { firebaseId: string }) {
    try {
      let user = await User.findBy('firebaseId', firebaseId)
      if (!user) {
        let newUser = new User()
        newUser.firebaseId = firebaseId
        await newUser.save()
        return newUser
      }
      return user
    } catch (error) {
      throw new BadRequestErrorException('Invalid credentials')
    }
  }

  async createPin({ userId, pin }: { userId: string; pin: string }) {
    let user = await User.find(userId)
    if (!user) {
      throw new NotFoundErrorException('User not found')
    }

    if (user.pin) {
      throw new BadRequestErrorException('User already has a pin')
    }

    user.pin = pin
    await user.save()
    return user
  }
}
