import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors/customError.js";
//대표적인 HTTP 상태코드를 기반으로 작성

//400 -> 잘못된 요청
export class RequestError extends CustomError{
    constructor(message = "잘못된 요청입니다."){
        super(StatusCodes.BAD_REQUEST, message);
    }
}

//401 -> 인증 실패
export class UnauthorizedError extends CustomError{
    constructor(message="인증이 필요합니다."){
        super(StatusCodes.UNAUTHORIZED, message);
    }
}

//403 -> 접근 권한이 없음
export class ForbiddenError extends CustomError {
  constructor(message = "접근이 허용되지 않았습니다.") {
    super(StatusCodes.FORBIDDEN, message);
  }
}

//404 -> 리소스가 없음
export class NotFoundError extends CustomError {
  constructor(message = "요청한 리소스를 찾을 수 없습니다.") {
    super(StatusCodes.NOT_FOUND, message);
  }
}

//409 -> 중복 데이터 
export class ConflictError extends CustomError {
  constructor(message = "요청이 충돌했습니다.") {
    super(StatusCodes.CONFLICT, message);
  }
}

//500 -> 서버 내부 오류
export class InternalServerError extends CustomError {
  constructor(message = "서버 내부 오류가 발생했습니다.") {
    super(StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
}