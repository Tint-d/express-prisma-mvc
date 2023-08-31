import { Response, Request } from "express";
import { SinginUserType } from "../Typings/Type";
import { prisma } from "../db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, password_confirmation }: SinginUserType =
      req.body;
    if (!name || !email || !password || !password_confirmation) {
      res.status(400);
      throw new Error("Please all fields");
    }
    if (password !== password_confirmation) {
      res.status(400).json({
        success: false,
        data: {
          error: "password and password_confirmation are not the same",
        },
      });
    }
    const userExists = await prisma.user.findMany({
      where: {
        email,
      },
    });

    if (userExists.length > 0) {
      res.status(409).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        password_confirmation,
      },
    });
    const responseData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    res.status(200).json({
      success: true,
      data: { message: "Register successfull!", data: responseData },
    });
    res.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error!",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(404).json({ error: "User not fond!" });
      return;
    }
    const responseData = {
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    };

    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
      res.status(200).json({
        message: "Login Successfully",
        data: { responseData },
      });
    } else {
      res.status(400).json({ error: "Password wrong!" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error!",
    });
  }
};

const generateToken = (userId: number) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string);
};
