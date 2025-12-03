import { addReviewToDB, isStoreExist, getAllUserReviews } from "../repositories/review.repository.js";
import { responseFromReview, responseFromReviews } from "../dtos/review.dto.js";
import { InternalServerError, NotFoundError } from "../errors/systemErrors.js";

//리뷰 추가
export const addReview = async (reviewDTO) => {
  //가게 존재 여부 검증
  const store = await isStoreExist(reviewDTO.store_id);
  if(!store){
    throw new NotFoundError("해당 가게를 찾을 수 없습니다.");
  }
  // 리뷰 추가
  const createdReview = await addReviewToDB(reviewDTO);
  if (!createdReview){ 
    throw new InternalServerError("리뷰 등록에 실패했습니다.");
  }

  // 응답 데이터 반환
  return responseFromReview(createdReview);
};

//리뷰 목록 조회
export const listUserReviews = async (userId, cursor) => {
  const reviews = await getAllUserReviews(userId, cursor);
  //리뷰 존재 하지 않은 경우
    if(!reviews || reviews.length === 0){
      throw new NotFoundError("해당 사용자가 등록한  리뷰는 없습니다.");
    }
  return responseFromReviews(reviews);
};