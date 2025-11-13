import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";

export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error caught:", err);

  if (res.headersSent) return next(err);

  let status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "Unexpected error occurred.";
  let name = err.name || "InternalError";

  // Prisma 에러 표준화
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      status = StatusCodes.CONFLICT;
      name = "ConflictError";
      message = "이미 존재하는 데이터입니다.";
    }
  }

  return res.status(status).json({
    success: false,
    error: { name, message },
  });
};