import expres from "express";
import { validateBody } from "../../decorators/index.js";
import contactControllerrs from "../../controllers/contact-controllerrs.js";
import {
  contactAddShema,
  contactPatchShema,
  contactUpdateShema,
} from "../../models/contacts/contacts.js";
import { isValidId } from "../../middlewares/index.js";

const contactRouter = expres.Router();

contactRouter.get("/", contactControllerrs.getAllContacts);

contactRouter.get("/:contactId", isValidId, contactControllerrs.getContactById);

contactRouter.post(
  "/",
  validateBody(contactAddShema),
  contactControllerrs.addContact
);

contactRouter.put(
  "/:contactId",
  isValidId,
  validateBody(contactUpdateShema),
  contactControllerrs.updateContact
);

contactRouter.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(contactPatchShema),
  contactControllerrs.updateStatusContact
);

contactRouter.delete("/:contactId", contactControllerrs.removeContact);

export default contactRouter;
