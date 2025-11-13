import { bodyToReview, responseFromReview, responseFromReviews } from "../dtos/review.dto.js";  // ← 응답 DTO 추가
import { addReview, listUserReviews, listStoreReviews } from "../services/review.service.js";
import { NotFoundError } from "../errors/systemErrors.js";

// 리뷰 추가
export const handleAddReview = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    console.log(`Review 요청 storeId: ${storeId}`);

    if (!storeId) {
      throw new NotFoundError("storeId 값이 존재하지 않습니다!");
    }
    
    const reviewDTO = bodyToReview(req.body, storeId);
    const review = await addReview(reviewDTO);

    // 표준 응답 형식
    res.success(responseFromReview(review));
    
  } catch (err) {
    next(err);
  }
};

// 사용자 리뷰 목록 조회
export const handleListUserReviews = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;
    
    const reviews = await listUserReviews(userId, cursor);
    
    // 표준 응답 형식
    res.success(responseFromReviews(reviews));
    
  } catch (err) {
    next(err);
  }
};

// 가게 리뷰 목록 조회
export const handleListStoreReviews = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const reviews = await listStoreReviews(storeId, cursor);

    // 표준 응답 형식
    res.success(responseFromReviews(reviews));
    
  } catch (err) {
    next(err);
  }
};