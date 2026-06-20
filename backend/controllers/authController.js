import { User } from "../models/index.js";
import { generateToken } from "../utils/generateToken.js";

function authResponse(user) {
  return {
    token: generateToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({ name, email, password });
    return res.status(201).json(authResponse(user));
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json(authResponse(user));
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  return res.json({ user: req.user });
}
