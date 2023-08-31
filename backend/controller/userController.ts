import { prisma } from "../db/prisma";
import { Response, Request } from "express";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({
      success: true,
      data: users,
    });
    console.log(users);
    res.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error!",
    });
  }
};
