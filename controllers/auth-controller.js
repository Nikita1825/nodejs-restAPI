import HttpError from "../helpers/httpError.js";
import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const {JWT_SECRET}= process.env

const signup = async (req, res)=>{
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email already exist")
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({...req.body, password: hashPassword});
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

export default {
  signup,
  signin,
  getCurrent,
  signout,
};