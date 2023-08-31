import express from "express";
import {
  createProduct,
  deleteProducts,
  getProducts,
  updateProducts,
} from "../controller/productController";

const productRouter = express.Router();

productRouter.route("/").get(getProducts);
productRouter.route("/create").post(createProduct);
productRouter.route("/:id").put(updateProducts).delete(deleteProducts);

export default productRouter;
