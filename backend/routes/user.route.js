import express from "express";

import {
  validateRegistration,
  validateLogin,
  validateEmail,
} from "../middlewares/userValidation.js";

import {
  login,
  register,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  verifyResetPasswordCode,
  resendResetPasswordCode,
  resetPassword,
  refreshToken,
  profile,
  logout,
} from "../controllers/user.controllers.js";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.js";

const routes = express.Router();

routes.post("/register", validateRegistration, register);

routes.post("/verify-email", verifyEmail);
routes.post("/resend-verification-code", validateEmail, resendVerificationCode);

routes.post("/login", validateLogin, login);

routes.post("/forgot-password", validateEmail, forgotPassword);
routes.post("/verify-reset-password-code", verifyResetPasswordCode);
routes.post(
  "/resend-reset-password-code",
  validateEmail,
  resendResetPasswordCode
);
routes.post("/reset-password", resetPassword);

routes.post("/refresh-token", refreshToken);

routes.post("/profile", verifyJwtToken, profile);
routes.post("/logout", verifyJwtToken, logout);

export default routes;
