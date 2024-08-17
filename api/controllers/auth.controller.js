import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, password, avatar } = req.body;

  try {
    // Check if the email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      return res.status(400).send({
        message:
          "Email or Username already in use. Please use different credentials.",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save to the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        avatar,
      },
    });

    res.status(201).send({
      message: "User Created Successfully",
      success: true,
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      Error: error.message,
      message: "Failed to create user!",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user)
      return res.status(401).send({
        message: "Inavlid Credentials!",
      });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).send({
        message: "Inavlid Credentials!",
      });

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: age,
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true
        maxAge: age,
      })
      .status(200)
      .json({
        message: "Login Successfull",
      });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to login user!",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({
    message: "Logout Successfull",
  });
};
