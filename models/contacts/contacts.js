import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, preUpdate } from "../hooks.js";

const contactsShema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

contactsShema.post("save", handleSaveError);
contactsShema.post("findOneAndUpdate", handleSaveError);
contactsShema.pre("findOneAndUpdate", preUpdate);

// =================JOI_Shema==============================
export const contactAddShema = Joi.object({
  name: Joi.string().min(1).required().messages({
    "string.base": `"name" should be a type of 'text'`,
    "string.empty": `"name" cannot be an empty field`,
    "string.min": `"name" should have a minimum length of {#limit}`,
    "any.required": `"name" is a required field`,
  }),
  email: Joi.string().min(3).required().messages({
    "string.base": `"email" should be a type of 'text'`,
    "string.empty": `"email" cannot be an empty field`,
    "string.min": `"email" should have a minimum length of {#limit}`,
    "any.required": `"email" is a required field`,
  }),
  phone: Joi.string().min(7).required().messages({
    "string.base": `"phone" should be a type of 'text'`,
    "string.empty": `"phone" cannot be an empty field`,
    "string.min": `"phone" should have a minimum length of {#limit}`,
    "any.required": `"phone" is a required field`,
  }),
  favorite: Joi.boolean().required().messages({
    "any.required": `"favorite" is a required field`,
  }),
});
export const contactUpdateShema = Joi.object({
  name: Joi.string().min(1).messages({
    "string.base": `"name" should be a type of 'text'`,
    "string.empty": `"name" cannot be an empty field`,
    "string.min": `"name" should have a minimum length of {#limit}`,
  }),
  email: Joi.string().min(3).messages({
    "string.base": `"email" should be a type of 'text'`,
    "string.empty": `"email" cannot be an empty field`,
    "string.min": `"email" should have a minimum length of {#limit}`,
  }),
  phone: Joi.string().min(7).messages({
    "string.base": `"phone" should be a type of 'text'`,
    "string.empty": `"phone" cannot be an empty field`,
    "string.min": `"phone" should have a minimum length of {#limit}`,
  }),
  favorite: Joi.boolean(),
});
export const contactPatchShema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": `missing field favorite`,
  }),
});
// ========================================================

const Contact = model("contact", contactsShema);

export default Contact;
