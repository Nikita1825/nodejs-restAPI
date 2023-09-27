import Contact from "../models/contact.js";
import HttpError from "../helpers/httpError.js";





const listContacts = async (req, res) => {
   const { _id: owner } = req.user;
  const result = await Contact.find({ owner }.populate("owner", "email password"));
  
  res.json(result);
};

const getContactById = async (req, res) => {
  const contactId = String(id);
  const { _id: owner } = req.user;
  
  const result = await Contact.findById({ _id: contactId, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const removeContact = async (req, res) => {
  const contactId = req.params.contactId;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpErrors(404, `Not found`);
  }
  res.json({
    message: "Contact deleted",
  });
};

const addContact = async (req, res) => {
  const {_id: owner}= req.user
const result = await Contact.create({...req.body, owner});
res.status(201).json(result);
};
const updateContact = async (req, res) => {
  const { _id: owner } = req.user;
  const contactId = req.params.contactId;
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId, owner },
    req.body,
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);

};
export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
