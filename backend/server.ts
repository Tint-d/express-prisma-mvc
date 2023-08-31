import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import categoryRouter from "./routes/categoryRoute";
import productRouter from "./routes/productRoute";
import authRouter from "./routes/authRoute";
import { errorHandler } from "./middleware/errorMiddleware";
import { protect } from "./middleware/authMiddleware";

const app = express();
const port = 5000;

app.use(express.json());
app.use(errorHandler);
app.use("/api/v1/products", protect, productRouter);
app.use("/api/v1/category", protect, categoryRouter);
app.use("/api/v1/auth", authRouter);

app.listen(port, () => {
  console.log(`server is running on${port}`);
});
