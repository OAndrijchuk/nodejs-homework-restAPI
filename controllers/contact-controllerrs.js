import { HttpError } from "../helpers/index.js";
import Contact from "../models/contacts/contacts.js";
import { controllerWrapper } from "../decorators/index.js";

const getAllContacts = async (req, res) => {
  const { _id } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const rezult = await Contact.find({ owner: _id }, "", { skip, limit });
  res.json(rezult);
};

const getContactById = async (req, res) => {
  const { _id } = req.user;
  const rezult = await Contact.findOne({
    _id: req.params.contactId,
    owner: _id,
  });
  if (!rezult) {
    throw HttpError(404, `Contact with id:${req.params.contactId} not found`);
  }
  res.json(rezult);
};

const addContact = async (req, res) => {
  const { _id } = req.user;
  const rezult = await Contact.create({ ...req.body, owner: _id });
  res.status(201).json(rezult);
};

const updateContact = async (req, res) => {
  const {
    params: { contactId },
    body,
  } = req;
  const { _id } = req.user;
  const rezult = await Contact.findOneAndUpdate(
    { _id: contactId, owner: _id },
    body
  );
  if (!rezult) {
    throw HttpError(404, `Contact with id:${contactId} not found`);
  }
  res.json(rezult);
};

const updateStatusContact = async (req, res) => {
  const {
    params: { contactId },
    body,
  } = req;
  const { _id } = req.user;

  const rezult = await Contact.findOneAndUpdate(
    { _id: contactId, owner: _id },
    body
  );
  if (!rezult) {
    throw HttpError(404, `Contact with id:${contactId} not found`);
  }
  res.json(rezult);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id } = req.user;
  const rezult = await Contact.findOneAndDelete({ _id: contactId, owner: _id });
  if (!rezult) {
    throw HttpError(404, `Contact with id:${contactId} not found`);
  }
  res.json({ message: "contact deleted" });
};

export default {
  getAllContacts: controllerWrapper(getAllContacts),
  getContactById: controllerWrapper(getContactById),
  addContact: controllerWrapper(addContact),
  updateContact: controllerWrapper(updateContact),
  updateStatusContact: controllerWrapper(updateStatusContact),
  removeContact: controllerWrapper(removeContact),
};
