import * as ReviewRepository from "../repository/review.repository.js";

export const getMyReviews = async (user_id) => {
  return await ReviewRepository.findReviewsByUser(user_id);
};