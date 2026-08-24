import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";

export function verifyAccessToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      message: "No Access Token",
    });
  }

  // let it be we are acepting Bearer TOken or .... Token
  const accessToken = header.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({
      message: "No Access Token",
    });
  }

  try {
    const decoded = jwt.verify(accessToken, config.JWT_SECRET);
    req.userId = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
}

export async function userExists(req, res, next) {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(401).json({
        message: "User Does Not Exist",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}