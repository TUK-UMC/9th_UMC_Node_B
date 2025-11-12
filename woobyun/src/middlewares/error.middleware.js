import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Prism의 공식 에러 코드임
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      // P2002: 고유 제약 조건 위반 (예: 중복된 필드 값으로 인해 발생)
      case "P2002":
        return res.status(StatusCodes.CONFLICT).json({
          error: "이미 존재하는 데이터입니다.",
          detail: err.meta?.target,
        });

      // P2003: 외래키에 제약 실패 (예: 존재하지 않는 store_id를 mission에 삽입하는 것)
      case "P2003":
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: "참조된 데이터가 존재하지 않습니다.",
        });

      // P2025: 요청한 데이터가 존재하지 않는 것
      case "P2025":
        return res.status(StatusCodes.NOT_FOUND).json({
          error: "요청한 데이터가 존재하지 않습니다.",
        });

      default:
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: `그 외의 Prisma 오류 (${err.code})`,
        });
    }
  }
};
