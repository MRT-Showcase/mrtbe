import { inject } from '@adonisjs/core'
import AuthenticationService from './authentication_service.js'
import { HttpContext } from '@adonisjs/core/http'
import { verifyNumberDTO } from './dto/verify_phone_number_dto.js'
import DefaultResponseBuilder from '#utils/default_response_builder'
import { registerDTO } from './dto/register_dto.js'
import { loginDTO } from './dto/login_dto.js'
import User from '#models/user'
import UnauthorizedException from '#exceptions/unauthorized_exception'

@inject()
export default class AuthenticationController {
  constructor(protected readonly authenticationService: AuthenticationService) {}

  async validatePhoneNumber({ request }: HttpContext) {
    let payload = await request.validateUsing(verifyNumberDTO)
    let phoneNumber = payload.phoneNumber
    let isValid = false
    let user = await this.authenticationService.validatePhoneNumber({ phoneNumber })
    if (user) {
      isValid = true
    }
    let response = {
      isPhoneNumberValid: isValid,
    }
    return new DefaultResponseBuilder<typeof response>()
      .setData(response)
      .setMessage('Successfully validated phone number')
      .setSuccess(true)
      .setStatusCode(200)
      .build()
  }

  async login({ request }: HttpContext) {
    let payload = await request.validateUsing(loginDTO)
    let user = await this.authenticationService.login({
      phoneNumber: payload.phoneNumber,
      pin: payload.pin,
    })

    let token = await User.accessTokens.create(user, ['*'], {
      name: 'authentication',
      expiresIn: '30 days',
    })

    let response = {
      user,
      token,
    }

    return new DefaultResponseBuilder<typeof response>()
      .setData(response)
      .setMessage('Successfully logged in')
      .setSuccess(true)
      .setStatusCode(200)
      .build()
  }

  async register({ request }: HttpContext) {
    let payload = await request.validateUsing(registerDTO)
    let user = await this.authenticationService.registerPhoneNumber({
      phoneNumber: payload.phoneNumber,
      pin: payload.pin,
    })
    return new DefaultResponseBuilder<User>()
      .setData(user)
      .setMessage('Successfully registered phone number')
      .setSuccess(true)
      .setStatusCode(201)
      .build()
  }

  async getUser({ auth }: HttpContext) {
    if (!auth.isAuthenticated) {
      return new UnauthorizedException('Unauthorized')
    }
    let user = auth.user
    return new DefaultResponseBuilder<typeof user>()
      .setData(user)
      .setMessage('Successfully fetched user')
      .setSuccess(true)
      .setStatusCode(200)
      .build()
  }
}
