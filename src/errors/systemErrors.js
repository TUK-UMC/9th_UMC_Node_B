// src/errors/systemErrors.js

export class BaseError extends Error {
  constructor({ reason, statusCode, errorCode, data = null }) {
    super(reason);
    this.reason = reason;
    this.statusCode = statusCode;
    this.errorCode = errorCode || "unknown";
    this.data = data;
  }
}

export class NotFoundError extends BaseError {
  constructor(reason = "요청한 데이터를 찾을 수 없습니다.", data = null) {
    super({
      reason,
      statusCode: 404,
      errorCode: "N001",
      data,
    });
  }
}

export class BadRequestError extends BaseError {
  constructor(reason = "잘못된 요청입니다.", data = null) {
    super({
      reason,
      statusCode: 400,
      errorCode: "B001",
      data,
    });
  }
}

export class RequestError extends BaseError {
  constructor(reason = "요청 처리 중 오류가 발생했습니다.", data = null) {
    super({
      reason,
      statusCode: 400,
      errorCode: "R001",
      data,
    });
  }
}

export class DuplicateError extends BaseError {
  constructor(reason = "이미 존재하는 데이터입니다.", data = null) {
    super({
      reason,
      statusCode: 400,
      errorCode: "D001",
      data,
    });
  }
}