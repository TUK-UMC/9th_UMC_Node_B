// src/errors/systemErrors.js

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

// usermission.controller.js에서 사용하는 RequestError 추가
export class RequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "RequestError";
    this.statusCode = 400; // 필요에 따라 변경 가능
  }
}
