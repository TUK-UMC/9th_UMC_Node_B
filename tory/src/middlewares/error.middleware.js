import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  if (res.headersSent) return next(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(StatusCodes.CONFLICT).json({ error: "중복된 소셜 계정입니다." });
    }
  }
  return res
    .status(err.status || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: err.name || "Error", message: err.message || "Unexpected error" });
};