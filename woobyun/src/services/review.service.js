import { addReviewToDB, isStoreExist } from "../repositories/review.repository.js";
import { responseFromReview } from "../dtos/review.dto.js";


export const addReview = async (reviewDTO) => {
  const storeExists = await isStoreExist(reviewDTO);
    if (!storeExists) {
      throw new Error(`store_id ${reviewDTO.store_id}에 해당하는 가게가 존재하지 않습니다.`);
    }

    // 리뷰 추가
    const reviewId = await addReviewToDB(reviewDTO);
    if (!reviewId) throw new Error("리뷰 등록에 실패했습니다.");

    // 응답 데이터 반환
    return responseFromReview({ id: reviewId, ...reviewDTO });
};
