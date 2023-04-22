import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";

async function login(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  // user doesn't exist
  if (!user) {
    return res.status(404).json({
      message: `User with ${email} doesn't exist`,
    });
  }

  // password is not correct
  if (!(await bcrypt.compare(password, user.hashedPassword))) {
    return res.status(401).json({
      message: `Password is Wrong`,
    });
  }

  const token = jwt.sign(
    { name: user.name, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "2d",
    }
  );

  return res.status(200).cookie("token", token).json({
    message: "ok",
  });
}

async function logout(req, res) {
  res.send(req.cookies);
}

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: `You didn't provided the required info`,
    });
  }

  const user = await userModel.findOne({ email });

  if (user) {
    return res.status(400).json({
      message: `User with ${email} already exist on server`,
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  // save to the db
  try {
    const user = await userModel.create({
      email,
      name,
      hashedPassword,
    });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export { login, logout, register };
