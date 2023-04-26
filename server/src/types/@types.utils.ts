export interface IExceptionResponseType {
  statusCode: number
  body: {
    type: string
    detail: string
  }
}

export interface ISuccessResponseType {
  statusCode: number
  message: string
}
