import express from "express";
import {
  deleteCategory,
  getCategory,
  updateCategory,
} from "../controller/categoryContorller";
// import {
//   createCategory,
//   deleteCategory,
//   getCategory,
//   updateCategory,
// } from "../../controller/categoryContorller";

const categoryRouter = express.Router();

categoryRouter.route("/create").post();
categoryRouter.route("/").get(getCategory);
categoryRouter.route("/:id").put(updateCategory).delete(deleteCategory);

export default categoryRouter;
