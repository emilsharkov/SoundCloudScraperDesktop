import { ValidationError } from "express-validator";

class ErrorWithCode extends Error {
    code: number;
  
    constructor(code: number, message: string, ) {
      super(message);
      this.code = code;
      Object.setPrototypeOf(this, ErrorWithCode.prototype);
    }
}

class BodyError extends Error {
  constructor(public errors: ValidationError[]) {
    super('Illegal request body');
    this.errors = errors
    Object.setPrototypeOf(this, BodyError.prototype);
  }
}

interface ErrorResponse {
  error: string;
}

export {
  ErrorWithCode,
  BodyError
}

export type {
  ErrorResponse
}