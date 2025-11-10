import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { reviewRegister } from "../services/review.service.js";

export const handleReviewRegister = async (req, res, next) => {
  console.log("리뷰 추가를 요청했습니다!");
  console.log("body:", req.body);

  const review = await reviewRegister(bodyToReview(req.body));
  res.status(StatusCodes.CREATED).json({ result: review });
};