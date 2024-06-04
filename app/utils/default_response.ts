export default class DefaultResponse<T> {
  declare statusCode: number
  declare message: string
  declare success: boolean
  declare data: T

  constructor(statusCode: number, message: string, success: boolean, data: T) {
    this.statusCode = statusCode
    this.message = message
    this.success = success
    this.data = data
  }
}
