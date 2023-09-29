import HttpError from "../helpers/httpError.js";
import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import fs from "fs/promises"
import path from "path"
import gravatar from "gravatar";

const { JWT_SECRET } = process.env;
const avatarsPath= path.resolve("public", "avatars")

const signup = async (req, res)=>{
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email already exist")
    }
  const hashPassword = await bcrypt.hash(password, 10)
  const avatarURL = gravatar.url(email);
    const newUser = await User.create({...req.body,avatarURL, password: hashPassword});
    res.status(201).json({
      email: newUser.email,
      password: newUser.password,
      subscription: newUser.subscription,
    });
}
const signin = async (req, res) => {
       const { email, password } = req.body;
       const user = await User.findOne({ email });

       if (!user) {
         throw HttpError(401, "Email or password is wrong");
       }

       const comparePassword = await bcrypt.compare(password, user.password);
       if (!comparePassword) {
         throw HttpError(401, "Email or password is wrong");
  }
  
  const {_id:id}= user
    const payload = {
       id,
    }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, {token})

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  
}
const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};
const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath)
  const avatarURL = path.join( "avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
   res.json({
     avatarURL,
   });

}

export default {
  signup,
  signin,
  getCurrent,
  signout,
  updateAvatar,
};