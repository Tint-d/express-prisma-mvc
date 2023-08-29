import express from "express";
import {
  createProduct,
  deleteProducts,
  getProducts,
  updateProducts,
} from "../controller/productController";

const router = express.Router();

router.route("/").get(getProducts);
router.route("/create").post(createProduct);
router.route("/:id").put(updateProducts).delete(deleteProducts);

export default router;
