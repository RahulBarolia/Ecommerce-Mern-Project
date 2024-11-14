import jwt from "jsonwebtoken";

export const generateAccessToken = (res, userId) => {
  const access_token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });

  res.cookie("access_token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  return access_token;
};

export const generateRefreshToken = (res, userId) => {
  const refresh_token = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });

  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return refresh_token;
};
