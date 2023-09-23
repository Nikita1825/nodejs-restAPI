import express from "express";
import Joi from "joi";
import {isValidid} from "../../middlewares/index.js"

import contactService from "../../controllers/contacts.js";
import { HttpError } from "../../helpers/index.js";
const contactsRouter = express.Router();
const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  id: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const changeSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).or("name", "email", "phone", "favoriate");

contactsRouter.get("/", contactService.listContacts);

contactsRouter.get("/:contactId",isValidid, contactService.getContactById)


contactsRouter.post("/", contactAddSchema, contactService.addContact);

contactsRouter.delete("/:contactId", isValidid, contactService.removeContact)


contactsRouter.put("/:contactId", isValidid, changeSchema, contactService.updateContact)

contactsRouter.patch(
  "/:contactId/favorite",
  isValidid,
  changeSchema,
  contactService.updateContact
);
  


export default contactsRouter;
