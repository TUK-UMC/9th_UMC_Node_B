import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { addReview } from "../services/review.service.js";
import { listUserReviews } from "../services/review.service.js";
import { CustomError } from "../errors/customError.js";
import { successHandler } from "../middlewares/successHandler.js";

//리뷰 추가
export const handleAddReview = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    //jwt가져오기
    const userId = req.user.user_id;    
    //가게가 존재하는지 검증
    if(!storeId || isNaN(storeId)){
      throw new CustomError(StatusCodes.BAD_REQUEST, "유효한 storeId가 필요.");
    }

    //유효한 입력값 검증
    const {rating, content} = req.body;
    if(!content || content.trim() === 0 || !rating || isNaN(rating) ){
      throw new CustomError(StatusCodes.BAD_REQUEST, "리뷰와 별점 등록은 필수 입니다.");
    }

    //DTO 변환
    const reviewDTO = bodyToReview(req.body, storeId, userId);
    //서비스 호출
    const review = await addReview(reviewDTO);

    return successHandler(
      res, 
      StatusCodes.CREATED, 
      "리뷰가 성공적으로 추가되었습니다.", 
      review
    );

  } catch (err) {
    next(err);
  }
};

//사용자의 리뷰 목록 조회
export const handleListUserReviews = async (req, res, next) => {
  try{
    //jwt에서 가져오기
    const userId = req.user.id;
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor): 0;

    const reviews = await listUserReviews(userId, cursor);

    return successHandler(
      res, 
      StatusCodes.OK, 
      "리뷰 목록 조회 성공", 
      reviews
    );

  }catch(err) {
    next(err);
  }
};