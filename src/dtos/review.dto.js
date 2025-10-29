export const bodyToReview = (body) => {
  return {
    userId: body.userId,
    storeId: body.storeId,
    rating: body.rating,
    content: body.content || "",
  };
};

export const responseFromReview = ({ review }) => {
  return {
    id: review.id,
    userId: review.user_id,
    storeId: review.store_id,
    rating: review.rating,
    content: review.content,
    createdAt: review.created_at,
  };
};