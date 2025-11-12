import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { addReview } from "../services/review.service.js";
import { listUserReviews } from "../services/review.service.js";

//리뷰 추가
export const handleAddReview = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);

    console.log(`Review 요청 storeId: ${storeId}`);
    //storeId의 존재 여부를 확인
    if(!storeId) throw new NotFoundError("storeId 값이 존재하지 않습니다!");
    
    //DTO 변환
    const reviewDTO = bodyToReview(req.body, storeId);

    //비즈니스 로직을 호출
    const review = await addReview(reviewDTO);

    res.status(StatusCodes.CREATED).json({ result: review });
  } catch (err) {//에러가 발생했을 때 실행되는 부분
    next(err);
  }
};

//리뷰 목록 조회
export const handleListUserReviews = async (req, res, next) => {
  try{
    const userId = parseInt(req.params.userId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor): 0;
    
    const reviews = await listUserReviews(userId, cursor);
    res.status(StatusCodes.OK).json(reviews);
  }catch(err) {
    next(err);
  }
};
