import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { addReview } from "../services/review.service.js";
import { listUserReviews } from "../services/review.service.js";

//리뷰 추가
export const handleAddReview = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    console.log(`Review 요청 storeId: ${storeId}`);
    
    //DTO 변환
    const reviewDTO = bodyToReview(req.body, storeId);
    //비즈니스 로직을 호출
    const review = await addReview(reviewDTO);

    res.status(StatusCodes.CREATED).json({
      isSuccess: true,
      code:StatusCodes.CREATED,
      message: "리뷰가 성공적으로 추가됐습니다.",
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

//리뷰 목록 조회
export const handleListUserReviews = async (req, res, next) => {
  try{
    const userId = parseInt(req.params.userId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor): 0;
    
    const reviews = await listUserReviews(userId, cursor);
    res.status(StatusCodes.OK).json({
      isSuccess: true,
      code: StatusCodes.OK,
      message: "리뷰 목록 조회",
      data: reviews,
    });
  }catch(err) {
    next(err);
  }
};
