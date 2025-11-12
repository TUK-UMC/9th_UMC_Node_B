import { addReviewToDB, isStoreExist, getAllUserReviews } from "../repositories/review.repository.js";
import { responseFromReview, responseFromReviews } from "../dtos/review.dto.js";
import { NotFoundError, RequestError } from "../errors/systemErrors.js";

export const addReview = async (reviewDTO) => {
  const storeExists = await isStoreExist(reviewDTO);
  if (!storeExists) {
    throw new NotFoundError(`store_id ${reviewDTO.store_id}에 해당하는 가게가 존재하지 않습니다.`);
  }

  const createdReview = await addReviewToDB(reviewDTO);
  if (!createdReview) throw new RequestError("리뷰 등록에 실패했습니다.");

  return responseFromReview(createdReview);
};

export const listUserReviews = async (userId, cursor) => {
  const reviews = await getAllUserReviews(userId, cursor);
  return responseFromReviews(reviews);
};