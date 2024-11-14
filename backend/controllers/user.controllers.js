import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { sendVerificationEmailOtp } from "../mailtrap/sendVerificationEmailOtp.js";
import { sendResetPasswordOtp } from "../mailtrap/sendResetPasswordOtp.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const verificationOtp = Math.floor(100000 + Math.random() * 900000);

    const user = new User({
      name,
      email,
      password: hashPassword,
      verificationOtp,
      verificationOtpExpiresAt: Date.now() + 5 * 60 * 1000, //5 minutes
    });

    await user.save();

    await sendVerificationEmailOtp(email, name, verificationOtp);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const schema = Joi.object({
      code: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const user = await User.findOne({
      verificationOtp: code,
      verificationOtpExpiresAt: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpiresAt = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
        verificationOtp: undefined,
        verificationOtpExpiresAt: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        isEmailVerified: false,
        message: "Email not verified",
      });
    }

    const access_token = generateAccessToken(res, user._id);
    const refresh_token = generateRefreshToken(res, user._id);

    return res.status(200).json({
      success: true,
      message: "User Logged Successfully",
      user: {
        ...user._doc,
        password: undefined,
        verificationOtp: undefined,
      },
      access_token,
      refresh_token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  return res
    .status(200)
    .json({ success: true, message: "User logout successfully" });
};

export const resendVerificationCode = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User is already verified" });
    }

    const timeUntilExpiration = user.verificationOtpExpiresAt - Date.now();

    if (timeUntilExpiration > 0) {
      return res.status(400).json({
        success: false,
        message:
          "A verification code is already active. Please check your email.",
      });
    }

    const verificationOtp = Math.floor(100000 + Math.random() * 900000);

    user.verificationOtp = verificationOtp;
    user.verificationOtpExpiresAt = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendVerificationEmailOtp(email, user.name, verificationOtp);

    return res.status(200).json({
      success: true,
      message: "New Verification code sent successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const timeUntilExpiration = user.resetPasswordOtpExpiresAt - Date.now();

    const minutes = Math.floor(timeUntilExpiration / 60000);
    const seconds = Math.floor((timeUntilExpiration % 60000) / 1000);

    if (user.resetPasswordOtp && timeUntilExpiration > 0) {
      return res.status(400).json({
        success: false,
        message:
          "A forget password otp is already active. Please check your email.",
        timeRemaining: `${minutes} minute(s) and ${seconds} second(s) left`,
      });
    }

    const resetPasswordOtp = Math.floor(100000 + Math.random() * 900000);

    user.resetPasswordOtp = resetPasswordOtp;
    user.resetPasswordOtpExpiresAt = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendResetPasswordOtp(email, user.name, resetPasswordOtp);

    return res.status(200).json({
      success: true,
      message: "Reset Password otp send to your email",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyResetPasswordCode = async (req, res) => {
  const { code } = req.body;

  try {
    const schema = Joi.object({
      code: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const user = await User.findOne({
      resetPasswordOtp: code,
      resetPasswordOtpExpiresAt: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or Expired Reset Code" });
    }

    user.resetPasswordOtp = undefined;

    const reset_token = crypto.randomBytes(32).toString("hex");

    user.reset_token = reset_token;

    user.resetPasswordOtpExpiresAt = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Otp verified successfully",
      reset_token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resendResetPasswordCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const timeUntilExpiration = user.resetPasswordOtpExpiresAt - Date.now();

    if (timeUntilExpiration > 0) {
      return res.status(400).json({
        success: false,
        message: "A reset code is already active. Please check your email.",
      });
    }

    const newResetPasswordCode = Math.floor(100000 + Math.random() * 900000);

    user.resetPasswordOtp = newResetPasswordCode;
    user.resetPasswordOtpExpiresAt = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendResetPasswordOtp(email, user.name, newResetPasswordCode);

    return res.status(200).json({
      success: true,
      message: "New reset code sent successfully.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { resetToken, password, passwordConfirm } = req.body;

  try {
    const schema = Joi.object({
      resetToken: Joi.string().required(),
      password: Joi.string().min(6).required(),
      passwordConfirm: Joi.string()
        .valid(Joi.ref("password"))
        .min(6)
        .required()
        .messages({ "any.only": "Passwords must be match" }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const user = await User.findOne({
      reset_token: resetToken,
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    user.reset_token = undefined;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const profile = async (req, res) => {
  const userId = req.userId;
  return res.status(200).json({ success: true, userId });
};

export const refreshToken = (req, res) => {
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized-no token provided" });
  }

  try {
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized-invalid token" });
    }

    const new_access_token = generateAccessToken(res, decoded.userId);

    res.cookie("access_token", new_access_token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: "Access token refreshed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
