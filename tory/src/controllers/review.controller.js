import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { addReview, listUserReviews } from "../services/review.service.js";
import { NotFoundError } from "../errors/systemErrors.js";

export const handleAddReview = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    console.log(`Review 요청 storeId: ${storeId}`);

    if (!storeId) throw new NotFoundError("storeId 값이 존재하지 않습니다!");

    const reviewDTO = bodyToReview(req.body, storeId);
    const review = await addReview(reviewDTO);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "리뷰가 성공적으로 등록되었습니다.",
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

export const handleListUserReviews = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const reviews = await listUserReviews(userId, cursor);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "리뷰 목록 조회 성공",
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};