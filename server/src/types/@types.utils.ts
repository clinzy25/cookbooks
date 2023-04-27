export interface IExceptionResponse {
  statusCode: number
  body: { type: string; detail: string }
}

export interface ISuccessResponse {
  statusCode: number
  message: string
}
