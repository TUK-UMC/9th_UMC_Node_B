import { addReviewToDB, isStoreExist } from "../repositories/review.repository.js";
import { responseFromReview } from "../dtos/review.dto.js";


export const addReview = async (storeId, data) => {
  try {
    // 가게 존재 여부 검증
    const storeExists = await isStoreExist(storeId);
    if (!storeExists) {
      throw new Error(`store_id ${storeId}에 해당하는 가게가 존재하지 않습니다.`);
    }

    // 리뷰 추가
    const reviewId = await addReviewToDB(storeId, data);
    if (!reviewId) throw new Error("리뷰 등록에 실패했습니다.");

    // 응답 데이터 반환
    return responseFromReview({ id: reviewId, store_id: storeId, ...data });
  } catch (err) {
    console.error("Service Error:", err);
    throw err;
  }
};
