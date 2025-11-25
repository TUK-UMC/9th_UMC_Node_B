import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors/customError.js";

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  
  if (err instanceof CustomError){
    return res.status(err.StatusCode).json({
      isSuccess: false,
      code: err.StatusCode,
      message: err.message,
    });
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    isSuccess: false,
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "서버 내부 오류가 발생했습니다.",
  });
};


//multer 
