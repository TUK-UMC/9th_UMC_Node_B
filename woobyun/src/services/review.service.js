import { addReviewToDB, isStoreExist, getAllUserReviews } from "../repositories/review.repository.js";
import { responseFromReview, responseFromReviews } from "../dtos/review.dto.js";
import { InternalServerError } from "../errors/systemErrors.js";

//리뷰 추가
export const addReview = async (reviewDTO) => {
  //가게 존재 여부 검증
  await isStoreExist(reviewDTO.store_id);

  // 리뷰 추가
  const createdReview = await addReviewToDB(reviewDTO);
  if (!createdReview) throw new InternalServerError("리뷰 등록에 실패했습니다.");

  // 응답 데이터 반환
  return responseFromReview(createdReview);
};

//리뷰 목록 조회
export const listUserReviews = async (userId, cursor) => {
  const reviews = await getAllUserReviews(userId, cursor);
  return responseFromReviews(reviews);
};