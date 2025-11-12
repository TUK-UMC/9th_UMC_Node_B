import { StatusCodes } from "http-status-codes";

//대표적인 HTTP 상태코드를 기반으로 작성

export class CustomError extends Error{
    constructor(message, StatusCode){
        super(message);
        this.name = this.constructor.name;
        this.StatusCode = StatusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

//400 -> 잘못된 요청
export class RequestError extends CustomError{
    constructor(message = "잘못된 요청입니다."){
        super(message, StatusCodes.BAD_REQUEST);
    }
}

//401 -> 인증 실패
export class UnauthorizedError extends CustomError{
    constructor(message="인증이 필요합니다."){
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

//403 -> 접근 권한이 없음
export class ForbiddenError extends CustomError {
  constructor(message = "접근이 허용되지 않았습니다.") {
    super(message, StatusCodes.FORBIDDEN);
  }
}

//404 -> 리소스가 없음
export class NotFoundError extends CustomError {
  constructor(message = "요청한 리소스를 찾을 수 없습니다.") {
    super(message, StatusCodes.NOT_FOUND);
  }
}

//409 -> 중복 데이터 
export class ConflictError extends CustomError {
  constructor(message = "요청이 충돌했습니다.") {
    super(message, StatusCodes.CONFLICT);
  }
}

//500 -> 서버 내부 오류
export class InternalServerError extends CustomError {
  constructor(message = "서버 내부 오류가 발생했습니다.") {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}