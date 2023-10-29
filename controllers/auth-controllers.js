import bcrypt from "bcryptjs";
import { HttpError } from "../helpers/index.js";
import Users from "../models/auth/users.js";
import { controllerWrapper } from "../decorators/index.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { json } from "express";

const { JWT_SECRET, JWT_EXPIRATION_TIME } = process.env;

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await Users.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await Users.create({
    ...req.body,
    password: hashPassword,
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw HttpError(401, "Email or password is wrong");
  }
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION_TIME,
  });
  await Users.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const chengSubscription = async (req, res) => {
  const { _id } = req.user;
  const { body } = req;
  const user = await Users.findByIdAndUpdate(_id, body);
  res.status(200).json(user);
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const signOut = async (req, res) => {
  const { _id } = req.user;
  const user = await Users.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

export default {
  signUp: controllerWrapper(signUp),
  signIn: controllerWrapper(signIn),
  chengSubscription: controllerWrapper(chengSubscription),
  getCurrent: controllerWrapper(getCurrent),
  signOut: controllerWrapper(signOut),
};
