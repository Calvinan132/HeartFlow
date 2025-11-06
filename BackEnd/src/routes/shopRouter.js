import express from "express";
import {
  getAllProducts,
  getProductById,
  getAllCategories,
  getProductsByCategory,
} from "../controllers/shopControllers/productsController.js";

import authUser from "../middleWares/authUser.js";

let shopRouter = express.Router();
// Products
shopRouter.get("/products", getAllProducts);
shopRouter.get("/products/:id", getProductById);
shopRouter.get("/categories", getAllCategories);
shopRouter.get("/products/category/:categoryId", getProductsByCategory);

export default shopRouter;
