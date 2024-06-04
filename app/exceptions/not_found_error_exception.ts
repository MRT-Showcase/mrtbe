import { Exception } from '@adonisjs/core/exceptions'

export default class NotFoundErrorException extends Exception {
  static status = 404
}
