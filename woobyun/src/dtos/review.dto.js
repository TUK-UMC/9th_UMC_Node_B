//입력 DTO
export const bodyToReview = (body, storeId) => ({
  store_id: storeId,
  user_id: body.user_id,
  rating: body.rating,
  content: body.content,

});

//출력 DTO
export const responseFromReview = (review) => ({
  review_id: review.id,
  store_id: review.store_id,
  user_id: review.user_id,
  rating: review.rating,
  content: review.content,
  created_at: review.created_at,
});
