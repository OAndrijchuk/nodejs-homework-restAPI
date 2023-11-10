import Jimp from "jimp";
import bcrypt from "bcryptjs";
import { HttpError, sendEmail } from "../helpers/index.js";
import Users from "../models/auth/users.js";
import { controllerWrapper } from "../decorators/index.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from 'gravatar';
import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const { JWT_SECRET, JWT_EXPIRATION_TIME, BASE_URL } = process.env;
const avatarPath = path.resolve('public', 'avatars');


const signUp = async (req, res) => {
  const { email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await Users.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newEmail = email.trim().toLowerCase();
  const avatarURL = `${gravatar.url(newEmail, { s: '80', r: 'pg', d: 'mp' })}`;
  const verificationToken = nanoid();
  const newUser = await Users.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const massage = {
    userEmail:email,
    title: "NodeJS verification!",
    bodyContent: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">!!!Click to verify email!!!</a>`
  };
   sendEmail(massage);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL,
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

const chengAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename)
  Jimp.read(oldPath, function (err, avatar) {
        if (err) throw err.massage;
        avatar.resize(250, 250)
             .quality(60)                 
             .write(newPath); 
  });
  await fs.unlink(oldPath);
  const avatarURL = path.join('avatars', filename)
  const user = await Users.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({
    avatarURL:user.avatarURL,
  });
};

const verificationRequest = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await Users.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "Not found!");
  }
  await Users.findOneAndUpdate({ verificationToken: null, verify: true });
  res.status(200).json({
  message: 'Verification successful',
});
};

const reverify = async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ email });
  if (!user) {
    throw HttpError(404, "User with this email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verificationToken = nanoid();
  const newUser = await Users.findOneAndUpdate({email},{verificationToken})
  const massage = {
    userEmail:email,
    title: "NodeJS ReVerification!",
    bodyContent: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">!!!Click to verify email!!!</a>`
  };
   
  sendEmail(massage);

  res.status(200).json({
  message: 'Verification email sent',
});
};

export default {
  signUp: controllerWrapper(signUp),
  signIn: controllerWrapper(signIn),
  chengSubscription: controllerWrapper(chengSubscription),
  getCurrent: controllerWrapper(getCurrent),
  signOut: controllerWrapper(signOut),
  chengAvatar: controllerWrapper(chengAvatar),
  verificationRequest: controllerWrapper(verificationRequest),
  reverify: controllerWrapper(reverify),
};
