import expres from "express";
import { validateBody } from "../../decorators/index.js";
import contactControllerrs from "../../controllers/contact-controllerrs.js";
import {
  contactAddShema,
  contactUpdateShema,
} from "../../joiShemas/contacts-shema.js";
const contactRouter = expres.Router();

contactRouter.get("/", contactControllerrs.getAllContacts);

contactRouter.get("/:contactId", contactControllerrs.getContactById);

contactRouter.post(
  "/",
  validateBody(contactAddShema),
  contactControllerrs.addContact
);

contactRouter.delete("/:contactId", contactControllerrs.removeContact);

contactRouter.put(
  "/:contactId",
  validateBody(contactUpdateShema),
  contactControllerrs.updateContact
);

export default contactRouter;
