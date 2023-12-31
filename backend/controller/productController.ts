import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { CreateProductRequest } from "../Typings/Type";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, categoryId }: CreateProductRequest =
      req.body;
    const pd = await prisma.product.create({
      data: {
        name,
        price,
        description,
        categoryId,
      },
      include: {
        category: { select: { name: true } }, // Include the category name in the response
      },
    });

    res.status(200).json({
      success: true,
      data: { product: pd },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to create product." });
  }
};

export const getProducts = async (req: Request, res: Response) => {
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
    const pd = await prisma.product.findMany({
      orderBy: sortingOptions,
      where: searchQuery,
      skip,
      take: itemsPerPage,
      include: {
        category: true, // Include the associated category
      },
    });

    const transformedProducts = pd.map((product) => ({
      ...product,
      categoryId: undefined,
    }));
    res
      .status(200)
      .json({ success: true, data: { products: transformedProducts } });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching products.",
    });
  }
};

export const updateProducts = async (req: Request, res: Response) => {
  const pdId = parseInt(req.params.id);
  const updatedProductData: CreateProductRequest = req.body;

  try {
    const data = await prisma.product.update({
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

export const deleteProducts = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.product.delete({
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
