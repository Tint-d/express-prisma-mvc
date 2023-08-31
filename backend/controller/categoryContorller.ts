import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { CategoryType, CreateProductRequest } from "../Typings/Type";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name }: CategoryType = req.body;
    console.log(name);

    const cat = await prisma.category.create({
      data: {
        name,
      },
    });
    res.status(200).json({ success: true, data: { category: cat } });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to create product." });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const { sortBy, sortOrder, search, page, pageSize } = req.query;

    const searchQuery = search ? { name: { contains: search as string } } : {};
    const pageNumber = parseInt(page as string) || 1;
    const itemsPerPage = parseInt(pageSize as string) || 10;
    const skip = (pageNumber - 1) * itemsPerPage;
    let sortingOptions = {};
    if (sortBy && sortOrder) {
      sortingOptions = {
        [sortBy as string]: sortOrder === "desc" ? "desc" : "asc",
      };
    }
    const pd = await prisma.category.findMany({
      orderBy: sortingOptions,
      where: searchQuery,
      skip,
      take: itemsPerPage,
    });
    res.status(200).json({ success: true, data: { products: pd } });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching products.",
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const pdId = parseInt(req.params.id);
  const updatedProductData: CreateProductRequest = req.body;

  try {
    const data = await prisma.category.update({
      where: {
        id: pdId,
      },
      data: updatedProductData,
    });

    res.status(200).json({ success: true, data });
    res.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An error occurred while updating the product.",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.category.delete({
      where: { id },
    });
    res
      .status(200)
      .json({ success: true, message: "Product successful delete." });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An error occurred while deleting the product.",
    });
  }
};
