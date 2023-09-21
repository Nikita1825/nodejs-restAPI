import express from 'express'
import Joi from "joi"

import contactService from "../../models/contacts.js"
import {HttpError} from "../../helpers/index.js"
const contactsRouter = express.Router();
const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  id: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const changeSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
}).or("name", "email", "phone");

contactsRouter.get('/', async (req, res, next) => {
  try {
    const result = await contactService.listContacts();
    res.json(result);
  } catch (error) {
   next(error);
  }
  
})

contactsRouter.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactService.getContactById(contactId);
    if (!result) {
     throw HttpError(404, "message : Not found");
      
      
    }
    res.json(result);
  } catch (error) {
   next(error)
  }
  
})

contactsRouter.post('/', async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message)
    }
    const result = await contactService.addContact(req.body);
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

contactsRouter.delete('/:contactId', async (req, res, next) => {
try {
  const { contactId } = req.params;
  const result = await contactService.removeContact(contactId);
   if (!result) {
     throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json({ message: "Not found" });
} catch (error) {
  next(error)
}
})

contactsRouter.put('/:contactId', async (req, res, next) => {
    try {
      const { error } = changeSchema.validate(req.body);
      if (error) {
        throw HttpError(400, error.message);
      }
      const { contactId } = req.params;
      const result = await contactService.updateContact(contactId, req.body);
      if (!result) {
        throw HttpError(404, "Not found");
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
})

export default contactsRouter;
