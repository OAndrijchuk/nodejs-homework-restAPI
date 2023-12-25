import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, preUpdate } from "../hooks.js";

const regexpEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userShema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
      minlength: 6,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: regexpEmail,
    },
    avatarURL: {
      type: String
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);
userShema.post("save", handleSaveError);
userShema.post("findOneAndUpdate", handleSaveError);
userShema.pre("findOneAndUpdate", preUpdate);

// =================JOI_Shema==============================
export const userSignUpShema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.base": `"password" should be a type of 'text'`,
    "string.empty": `"password" cannot be an empty field`,
    "string.min": `"password" should have a minimum length of {#limit}`,
    "any.required": `"password" is a required field`,
  }),
  email: Joi.string().min(3).required().pattern(regexpEmail).messages({
    "string.base": `"email" should be a type of 'text'`,
    "string.empty": `"email" cannot be an empty field`,
    "string.min": `"email" should have a minimum length of {#limit}`,
    "any.required": `"email" is a required field`,
  }),
  subscription: Joi.string().min(7).messages({
    "string.base": `"subscription" should be a type of 'text'`,
    "string.empty": `"subscription" cannot be an empty field`,
    "string.min": `"subscription" should have a minimum length of {#limit}`,
  }),
});
export const userSignInShema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.base": `"password" should be a type of 'text'`,
    "string.empty": `"password" cannot be an empty field`,
    "string.min": `"password" should have a minimum length of {#limit}`,
    "any.required": `"password" is a required field`,
  }),
  email: Joi.string().min(3).required().pattern(regexpEmail).messages({
    "string.base": `"email" should be a type of 'text'`,
    "string.empty": `"email" cannot be an empty field`,
    "string.min": `"email" should have a minimum length of {#limit}`,
    "any.required": `"email" is a required field`,
  }),
});
export const userVerifyShema = Joi.object({
  email: Joi.string().min(3).required().pattern(regexpEmail).messages({
    "string.base": `"email" should be a type of 'text'`,
    "string.empty": `"email" cannot be an empty field`,
    "string.min": `"email" should have a minimum length of {#limit}`,
    "any.required": `Missing required field email`,
  }),
});

// ========================================================

const Users = model("user", userShema);

export default Users;
