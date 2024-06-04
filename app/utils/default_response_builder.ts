import DefaultResponse from './default_response.js'

export default class DefaultResponseBuilder<T> {
  declare statusCode: number
  declare message: string
  declare success: boolean
  declare data: T

  setStatusCode(statusCode: number): DefaultResponseBuilder<T> {
    this.statusCode = statusCode
    return this
  }

  setMessage(message: string): DefaultResponseBuilder<T> {
    this.message = message
    return this
  }

  setSuccess(success: boolean): DefaultResponseBuilder<T> {
    this.success = success
    return this
  }

  setData(data: T): DefaultResponseBuilder<T> {
    this.data = data
    return this
  }

  build(): DefaultResponse<T> {
    return new DefaultResponse<T>(this.statusCode, this.message, this.success, this.data)
  }
}
