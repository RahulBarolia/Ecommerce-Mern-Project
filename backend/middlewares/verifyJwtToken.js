import jwt from "jsonwebtoken";

export const verifyJwtToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized-no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized-invalid token" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
