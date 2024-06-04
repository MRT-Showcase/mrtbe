import { Exception } from '@adonisjs/core/exceptions'

export default class BadRequestErrorException extends Exception {
  static status = 400
}
