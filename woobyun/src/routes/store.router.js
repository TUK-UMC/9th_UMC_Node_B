import express from "express";
import { handleAddStore } from "../controllers/store.controller.js";
import { isLogin } from "../middlewares/islogin.middleware.js";

const storeRouter = express.Router();

// 가게 등록 API — 로그인 필요
storeRouter.post("/stores", isLogin, handleAddStore);
export { storeRouter };
