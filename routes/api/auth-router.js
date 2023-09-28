import express from "express";
const authRouter = express.Router();
import { isValidid } from "../../middlewares/index.js";
import Joi from "joi";
import authController from "../../controllers/auth-controller.js";
import { authenticate, upload, resizeAvatar } from "../../middlewares/index.js";

const userSignUpSchema = Joi.object({
  password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
  subscritions: Joi.string()
});
const userSignInSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});

authRouter.post("/signup", userSignUpSchema, isValidid, authController.signup);
authRouter.post("/signin", userSignInSchema, isValidid);

authRouter.get("/current", authenticate, authController.getCurrent)
authRouter.post("/signout", authenticate, authController.signout);
authRouter.patch("/avatars", authenticate, upload.single("avatars"), resizeAvatar, authController.updateAvatar);


export default authRouter;