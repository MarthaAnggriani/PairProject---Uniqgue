const Controller = require("../controllers");
const router = require("express").Router();
const authenticated = require("../middlewares/authenticated");
const isAdmin = require("../middlewares/isAdmin");

router.get('/', Controller.home);//landingpage
router.get('/u', Controller.homeUser);
router.get('/a', Controller.homeAdmin);
router.get('/users', Controller.users);
router.get('/products', Controller.products);
router.get('/productsAdmin', Controller.productsAdmin);
router.get('/register', Controller.register);
router.post('/register', Controller.createUser);
router.get('/login', Controller.showLoginForm);
router.post('/login', Controller.login);
router.get('/logout', Controller.logout);
router.get('/addProduct', Controller.addProductForm);
router.post('/addProduct', Controller.addProduct);
router.get('/products/:id/edit', authenticated, Controller.editProductForm); 
router.post('/products/:id/edit', authenticated, Controller.editProduct); 
router.post('/products/:id/delete', authenticated, Controller.deleteProduct);

module.exports = router;