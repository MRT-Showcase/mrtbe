import { inject } from '@adonisjs/core'
import AuthenticationService from './authentication_service.js'
import { HttpContext } from '@adonisjs/core/http'
import { verifyNumberDTO } from './dto/verify_phone_number_dto.js'
import DefaultResponseBuilder from '#utils/default_response_builder'
import { registerDTO, validateEmailAndPhoneNumber } from './dto/register_dto.js'
import { loginDTO } from './dto/login_dto.js'
import User from '#models/user'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import { loginGoogleDto } from '#authentication/dto/login_google_dto'
import { createPinDto } from '#authentication/dto/create_pin_dto'
import BadRequestErrorException from '#exceptions/bad_request_error_exception'

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
      email: payload.email,
      fullName: payload.fullName,
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

  async loginByGoogle({ request }: HttpContext) {
    let payload = await request.validateUsing(loginGoogleDto)
    let user = await this.authenticationService.loginWithGoogle({
      firebaseId: payload.firebaseId,
    })
    return new DefaultResponseBuilder<User>()
      .setData(user)
      .setMessage('Successfully logged in with google')
      .setSuccess(true)
      .setStatusCode(200)
      .build()
  }

  async createPin({ request, auth }: HttpContext) {
    if (!auth.isAuthenticated) {
      return new UnauthorizedException('Unauthorized')
    }
    let user = auth.getUserOrFail()

    if (!user.firebaseId) {
      return new BadRequestErrorException('You must be logged in with google')
    }

    let payload = await request.validateUsing(createPinDto)
    let returnedUser = await this.authenticationService.createPin({
      userId: user.id,
      pin: payload.pin,
    })

    return new DefaultResponseBuilder<typeof returnedUser>()
      .setData(returnedUser)
      .setMessage('Successfully created pin')
      .setSuccess(true)
      .setStatusCode(200)
      .build()
  }

  async validateEmailAndPhoneNumber({ request }: HttpContext) {
    let payload = await request.validateUsing(validateEmailAndPhoneNumber)
    let isValid = await this.authenticationService.validateEmail({
      email: payload.email,
      phoneNumber: payload.phoneNumber,
    })
    return new DefaultResponseBuilder<typeof isValid>()
      .setData(isValid)
      .setMessage('Successfully validated email')
      .setSuccess(true)
      .setStatusCode(200)
      .build()
  }
}
