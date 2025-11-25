import { Router } from "express";
import passport from "../config/passport.js";

const router = Router();

router.get("/oauth2/login/google",
  passport.authenticate("google", { session: false })
);

router.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    return res.status(200).json({
      resultType: "SUCCESS",
      success: {
        message: req.user.isNewUser ? "회원 가입 성공" : "로그인 성공",
        user_id: req.user.user_id,
        social_provider: req.user.social_provider,  
        token: {
          accessToken: req.user.accessToken,
          refreshToken: req.user.refreshToken,
        }
      }
    });
  }
);

export default router;