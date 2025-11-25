//입력 DTO
export const bodyToReview = (body, storeId, userId) => ({
  store_id: storeId,
  user_id: userId,
  rating: body.rating,
  content: body.content,
});

//출력 DTO
export const responseFromReview = (review) => ({
  review_id: review.review_id,
  store_id: review.store_id,
  user_id: review.user_id,
  rating: review.rating,
  content: review.content,
  created_at: review.created_at,
  updated_at: review.updated_at
});

//리뷰 목록 조회 출력 DTO
export const responseFromReviews = (reviews) => {
  const result = {
    data: reviews,
    pagination:{
      cursor: reviews.length ? reviews[reviews.length - 1].review_id : null
    }
  };
  return result;
};