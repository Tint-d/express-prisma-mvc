import * as dotenv from "dotenv";
dotenv.config();
import express from "express";

import router from "./routes/productRoute";

const app = express();
const port = 5000;

app.use(express.json());
app.use("/api/v1/products", router);

app.listen(port, () => {
  console.log(`server is running on${port}`);
});
