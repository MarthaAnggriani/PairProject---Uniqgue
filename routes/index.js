const express = require("express");
const Controller = require("../controllers");
const router = express.Router();
const authenticated = require("../middlewares/authenticated");
const isAdmin = require("../middlewares/isAdmin");

router
  .get("/", Controller.home)
  .get("/register", Controller.getRegister)
  .post("/register", Controller.postRegister)
  .get("/login", Controller.getLogin)
  .post("/login", Controller.postLogin)
  .use(authenticated)
  .get("/products", Controller.getProducts)
  .post("/products", Controller.addProducttoOrder)

  .get("/products/buy/:id", Controller.buyProduct)
  .get("/userProfile", Controller.getUserProfile)
  .get("/logout", Controller.getLogout)
  .get("/users", isAdmin, Controller.readUser)
  .get("/stocks", isAdmin, Controller.readStocks)

  .get("/products/add", isAdmin, Controller.addProductForm)
  .post("/products/add", isAdmin, Controller.addProduct)
  .get("/order/add/:userId/:productId", Controller.getAddOrderByUserId)
  .post("/order/add/:userId/:productId", Controller.postAddOrderByUserId)
  .get("/products/:productId/edit/", isAdmin, Controller.editProductForm)
  .post("/products/:productId/edit/", isAdmin, Controller.editProduct)
  .post("/products/:productId/delete", isAdmin, Controller.deleteProduct)

  .get("/order/delete/:userId/:orderDemandId", Controller.deleteOrder)
  .get("/order/detail/:userId/:orderDemandId", Controller.orderDetail)
  .get("/order/update/:userId/:orderDemandId", Controller.updateOrder)
  .get("/order/:userId", Controller.orderByUserId);

// .get("/order/:userId", Controller.orderByUserId);
module.exports = router;
