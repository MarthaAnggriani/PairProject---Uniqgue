const { User, Product, Order, Category } = require('../models');
// const formatCurrency = require('../helpers/formatCurrency');
const bcrypt = require('bcrypt');

class Controller {
    static home(req, res) {
        res.render("Home");
    }

    static homeUser(req, res) {
        res.render("HomeUser");
    }

    static homeAdmin(req, res) {
        res.render("HomeAdmin");
    }

    static users(req, res) {
        User.findAll()
            .then((users) => {
                res.send(users);
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            })
    }

    static products(req, res) {

        Product.findAll({ include: Category })
        .then((products) => {
          res.render("Product", { products });
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    }

    static productsAdmin(req, res) {

        Product.findAll({ include: Category })
        .then((products) => {
          res.render("ProductAdmin", { products });
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    }

    static register(req, res) {
        res.render("Register");
    }

    static createUser(req, res) {
        const { userName, email, password } = req.body;

        User.create({ userName, email, password, role: "user" })
            .then(user => {
                req.session.userId = user.id;
                req.session.role = user.role;
                // res.redirect('/home')
                res.redirect('/products')
            })
            .catch(er => {
                console.log(err);
                res.send(err);
            })
    }

    static showLoginForm(req, res) {
        res.render("Login")
    }

    static login(req, res) {
        const { email, password } = req.body;
        User.findOne({
            where: { email },
        }).then(user => {
            if (!user) throw "Unregistered email";

            if (user.role === "admin") {
                if (password !== user.password) {
                  throw "Wrong password!";
                }
                req.session.userId = user.id;
                req.session.role = user.role;
                return res.redirect("/a"); // Mengarahkan admin ke halaman /a
              } else {
                const isValidUser = bcrypt.compareSync(password, user.password);
                if (!isValidUser) throw "Wrong password!";
                req.session.userId = user.id;
                req.session.role = user.role;
                return res.redirect("/u"); // Mengarahkan user ke halaman /u
              }

            req.session.userId = user.id;
            req.session.role = user.role;
            res.redirect("/products")
        })
            .catch(err => {
                console.log(err);
                res.send(err);
            })
    }

    static logout(req, res) {

    }

    static addProductForm(req, res) {
        res.render("AddProduct");
    }

    static addProduct(req, res) {
        const { name, description, price, stock, rating, image, CategoryId } = req.body;

        Product.create({ name, description, price, stock, rating, image, CategoryId })
            .then(() => {
                res.redirect("/productsAdmin");
            })
            .catch((err) => res.send(err));
    }

    static editProductForm(req, res) {
        const productId = req.params.id;

        Product.findByPk(productId)
            .then((product) => {
                res.render("EditProduct", { product });
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
    }

    static editProduct(req, res) {
        const productId = req.params.id;
        const { name, description, price, stock, rating, image, CategoryId } = req.body;

        Product.update(
            { name, description, price, stock, rating, image, CategoryId },
            { where: { id: productId } }
        )
            .then(() => {
                res.redirect("/productsAdmin");
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
    }

    static deleteProduct(req, res) {
        const productId = req.params.id;

        Product.destroy({ where: { id: productId } })
            .then(() => {
                res.redirect("/productsAdmin");
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
    }

}

module.exports = Controller;