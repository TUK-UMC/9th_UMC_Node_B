import { addReviewToDB, isStoreExist } from "../repositories/review.repository.js";
import { responseFromReview, responseFromReviews } from "../dtos/review.dto.js";
import {getAllUserReviews} from "../repositories/review.repository.js";
import { prisma } from "../db.config.js";
//리뷰 추가
export const addReview = async (reviewDTO) => {
  const storeExists = await isStoreExist(reviewDTO);
    if (!storeExists) {
      throw new Error(`store_id ${reviewDTO.store_id}에 해당하는 가게가 존재하지 않습니다.`);
    }

    // 리뷰 추가
    const createdReview = await addReviewToDB(reviewDTO);
    if (!createdReview) throw new Error("리뷰 등록에 실패했습니다.");

    // 응답 데이터 반환
    return responseFromReview(createdReview);
};

//리뷰 목록 조회
export const listUserReviews = async (userId, cursor) => {
  const reviews = await getAllUserReviews(userId, cursor);
  return responseFromReviews(reviews);
};

// 특정 가게 리뷰 조회
export const listStoreReviews = async (storeId, cursor = 0) => {
  // 가게 존재 여부 확인
  const storeExists = await prisma.store.findUnique({
    where: { store_id: storeId },
  });
  if (!storeExists) {
    throw new Error(`store_id ${storeId}에 해당하는 가게가 존재하지 않습니다.`);
  }

  // 리뷰 조회
  const reviews = await prisma.review.findMany({
    where: { store_id: storeId, review_id: { gt: cursor } },
    orderBy: { review_id: "asc" },
    take: 5,
  });

  return responseFromReviews(reviews);
};
