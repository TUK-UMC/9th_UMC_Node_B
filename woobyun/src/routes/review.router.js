import express from "express";
import { handleAddReview, handleListUserReviews } from "../controllers/review.controller.js";
import { isLogin } from "../middlewares/islogin.middleware.js";

const reviewRouter  = express.Router();

reviewRouter.post("/stores/:storeId/reviews", isLogin, handleAddReview);
reviewRouter.get("/reviews/me", isLogin, handleListUserReviews);
export { reviewRouter };