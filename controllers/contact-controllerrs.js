import { HttpError } from "../helpers/index.js";
import Contact from "../models/contacts/contacts.js";
import { controllerWrapper } from "../decorators/index.js";

const getAllContacts = async (req, res) => {
  const rezult = await Contact.find();
  res.json(rezult);
};

// const getContactById = async (req, res) => {
//   const rezult = await contactService.getContactById(req.params.contactId);
//   if (!rezult) {
//     throw HttpError(404, `Contact with id:${req.params.contactId} not found`);
//   }
//   res.json(rezult);
// };

const addContact = async (req, res) => {
  const rezult = await Contact.create(req.body);
  res.status(201).json(rezult);
};

// const updateContact = async (req, res) => {
//   const {
//     params: { contactId },
//     body,
//   } = req;
//   const rezult = await contactService.updateContact(contactId, body);
//   if (!rezult) {
//     throw HttpError(404, `Contact with id:${contactId} not found`);
//   }
//   res.json(rezult);
// };

// const removeContact = async (req, res) => {
//   const { contactId } = req.params;
//   const rezult = await contactService.removeContact(contactId);
//   if (!rezult) {
//     throw HttpError(404, `Contact with id:${contactId} not found`);
//   }
//   res.json({ message: "contact deleted" });
// };

export default {
  getAllContacts: controllerWrapper(getAllContacts),
  // getContactById: controllerWrapper(getContactById),
  addContact: controllerWrapper(addContact),
  // removeContact: controllerWrapper(removeContact),
  // updateContact: controllerWrapper(updateContact),
};
