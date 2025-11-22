import express from "express";
import {
  getAllProducts,
  getProductById,
  getAllCategories,
  getProductsByCategory,
} from "../controllers/shopControllers/productsController.js";
import {
  addToCart,
  getCart,
  removeCart,
} from "../controllers/shopControllers/cartControllers.js";
//
import authUser from "../middleWares/authUser.js";

let shopRouter = express.Router();
// Products
shopRouter.get("/products", getAllProducts);
shopRouter.get("/products/:id", getProductById);
shopRouter.get("/categories", getAllCategories);
shopRouter.get("/products/category/:categoryId", getProductsByCategory);
shopRouter.post("/addtocart", authUser, addToCart);
shopRouter.get("/getcart", authUser, getCart);
shopRouter.delete("/removecart/:id", authUser, removeCart);
export default shopRouter;
