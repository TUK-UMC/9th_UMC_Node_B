export const bodyToReview = (body) => {
  const now = new Date();
  return {
    user_id: body.user_id,
    rating: body.rating,
    content: body.content,
    created_at: now,
    updated_at: now,
  };
};
export const responseFromReview = (review) => ({
  review_id: review.id,
  store_id: review.store_id,
  user_id: review.user_id,
  rating: review.rating,
  content: review.content,
  created_at: review.created_at,
});