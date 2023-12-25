import jwt from "jsonwebtoken";
import "dotenv/config";
import { HttpError } from "../helpers/index.js";
import User from "../models/auth/users.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(HttpError(401), "Not authorized");
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token) {
      return next(HttpError(401), "Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401), "Not authorized");
  }
};

export default authenticate;