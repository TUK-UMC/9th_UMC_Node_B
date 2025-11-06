import { addReview } from "../services/review.service.js";
import { StatusCodes } from "http-status-codes";

export const handleAddReview = async (req, res) => {
  try {
    console.log("리뷰 추가 요청이 들어왔습니다!");
    console.log("params:", req.params);
    console.log("body:", req.body);

    const storeId = req.params.storeId;
    const review = await addReview(storeId, req.body);

    res.status(StatusCodes.OK).json({ result: review });
  } catch (err) {
    console.error("Service Error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "리뷰 추가 중 오류가 발생했습니다.",
      detail: err.message,
    });
  }
};