import { Router } from "express";
import { isLogin } from "../middlewares/islogin.middleware.js";
import { handleUserUpdate } from "../controllers/user.controller.js";

const router = Router();

router.patch("/users/me", isLogin, handleUserUpdate);

export { router as userRouter };