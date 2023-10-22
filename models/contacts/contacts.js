// import fs from "fs/promises";
// import path from "path";
// import { nanoid } from "nanoid";

// const contactsPath = path.resolve("models", "contacts", "contacts.json");

// const updateContacts = (contacts) =>
//   fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

// export async function listContacts() {
//   // Повертає масив контактів.
//   const data = await fs.readFile(contactsPath, "utf-8");
//   return JSON.parse(data);
// }

// export async function getContactById(contactId) {
//   // Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
//   const contacts = await listContacts();
//   const findedContact = contacts.find((contact) => contact.id === contactId);
//   return findedContact || null;
// }

// export async function addContact(data) {
//   // Повертає об'єкт доданого контакту.
//   const newContact = { id: nanoid(), ...data };
//   const contacts = await listContacts();
//   contacts.push(newContact);
//   await updateContacts(contacts);
//   return newContact || null;
// }

// export async function removeContact(contactId) {
//   // Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.

//   const contacts = await listContacts();
//   const index = contacts.findIndex((contact) => contact.id === contactId);
//   if (index === -1) {
//     return null;
//   }
//   const [removedContact] = contacts.splice(index, 1);
//   await updateContacts(contacts);
//   return removedContact;
// }

// export async function updateContact(contactId, body) {
//   // Повертає об'єкт з оновленими даними.
//   const contacts = await listContacts();
//   const index = contacts.findIndex((contact) => contact.id === contactId);
//   if (index === -1) {
//     return null;
//   }
//   contacts[index] = { ...contacts[index], ...body };
//   await updateContacts(contacts);
//   return contacts[index];
// }

// export default {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// };
import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError } from "./hooks.js";

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
  },
  { versionKey: false, timestamps: true }
);

contactsShema.post("save", handleSaveError);

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
  favorite: Joi.boolean().required(),
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
// ========================================================

const Contact = model("contact", contactsShema);

export default Contact;
