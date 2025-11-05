import express from "express";
import { handleAddReview, handleListUserReviews } from "../controllers/review.controller.js";

const reviewRouter  = express.Router();
reviewRouter.post("/stores/:storeId/reviews", handleAddReview);
reviewRouter.get("/users/:userId/reviews", handleListUserReviews);
export { reviewRouter };