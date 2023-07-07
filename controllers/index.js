const {
  User,
  OrderDemand,
  UserProfile,
  Product,
  Category,
} = require("../models");
const bcrypt = require("bcryptjs");
const nodeMailer = require("./nodemailer");
const formatNumber = require("../helpers/formatter");

class Controller {
  static home(req, res) {
    const { error } = req.query;
    res.render("Home", { error });
  }
  static getRegister(req, res) {
    const { error } = req.query;
    res.render("Register", { error });
  }
  static postRegister(req, res) {
    const {
      userName,
      email,
      password,
      firstName,
      lastName,
      address,
      phoneNumber,
      profilePicture,
    } = req.body;
    User.create({ userName, email, password })
      .then((user) => {
        req.session.userId = user.id;
        req.session.role = user.role;
        UserProfile.create({
          firstName,
          lastName,
          address,
          phoneNumber,
          profilePicture,
          UserId: user.id,
        });
      })
      .then(() => {
        nodeMailer(email);
        res.redirect("/");
      })
      .catch((err) => {
        const errors = err.errors.map((e) => e.message);
        res.redirect(`/register?error=${errors}`);
      });
  }


  static getLogin(req, res) {
    const { error } = req.query;
    res.render("Login", { error });
  }
  static postLogin(req, res) {
    const { userName, email, password } = req.body;
    User.findOne({
      where: { email: email },
    })
      .then((user) => {
        if (user) {
          const isValidPassword = bcrypt.compareSync(password, user.password);
          if (isValidPassword) {
            //berhasil login
            req.session.userId = user.id;
            req.session.role = user.role;
            return res.redirect("/");
          } else {
            const error = "invalid password";
            return res.redirect(`/login?error=${error}`);
          }
        } else {
          const error = "invalid email";
          return res.redirect(`/login?error=${error}`);
        }
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static readUser(req, res) {
    User.findAll()
      .then((users) => {
        res.render("User", { users });
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static getLogout(req, res) {
    res.render("Login");
  }

  static products(req, res) {
    const { search } = req.query;

    let options = {
      include: Category,
      order: [["id", "DESC"]],
    };

    if (search) {
      options.where = {
        name: {
          [Op.iLike]: `%${search}%`,
        },
      };
    }

    Product.findAll(options)
      .then((products) => {
        res.render("Product", { products });
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static getLogout(req, res) {
    req.session.destroy();
    res.redirect("/");
  }

  static getUserProfile(req, res) {
    UserProfile.findOne({
      where: {
        UserId: req.session.userId,
      },
    })
      .then((user) => {
        res.render("UserProfile", { user });
      })
      .catch((err) => { });
  }

  static getProducts(req, res) {
    Product.findAll({})
      .then((product) => {
        const formattedPrice = product.map((el) => {
          return Product.formatPrice(el.price);
        });
        res.render("ProductsUser", { product, formattedPrice });
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static buyProduct(req, res) {
    const { id } = req.params;
    console.log(req.params);
    Product.findByPk(id)
      .then((product) => {
        product.decrement("stock");
      })
      .then(() => {
        res.redirect("/products");
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static addProducttoOrder(req, res) {
    res.redirect(`/order/add/${req.session.userId}/${req.body.productId}`);
  }

  static orderByUserId(req, res) {
    const { userId } = req.params;
    OrderDemand.findAll({
      include: { all: true },
      where: {
        UserId: req.session.userId,
      },
    })
      .then((order) => {
        order.map((e) => {
          e.price = e.Product.price * e.quantity;
        });
        res.render("Order", { order, userId });
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static orderDetail(req, res) {
    const { orderDemandId, userId } = req.params;
    OrderDemand.findByPk(orderDemandId, {
      include: ["Product"],
    })
      .then((order) => {
        order.price = order.Product.price * order.quantity;
        res.render("OrderDetail", { order, formatNumber });
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static getAddOrderByUserId(req, res) {
    let msg;
    if (req.query.errors) {
      msg = req.query.errors.split(",");
    }
    const { userId, productId } = req.params;

    res.render("formAddOrder", { userId, productId, msg });
  }

  static postAddOrderByUserId(req, res) {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    let price;
    Product.findByPk(productId)
      .then((product) => {
        if (price) {
          price = product.price * quantity;
        }
        const newOrder = {
          UserId: userId,
          ProductId: productId,
          quantity,
          price,
        };
        return OrderDemand.create(newOrder);
      })
      .then((order) => {
        return User.findByPk(userId);
      })
      .then((user) => {
        res.redirect(`/order/${userId}`);
      })
      .catch((err) => {
        if (err.name == "SequelizeValidationError") {
          const errors = err.errors.map((el) => {
            return el.message;
          });
          res.redirect(`/order/add/${userId}/${productId}?errors=${errors}`);
        } else {
          console.log(err);
          res.send(err);
        }
      });
  }

  static deleteOrder(req, res) {
    const { orderDemandId, userId } = req.params;
    OrderDemand.destroy({
      where: {
        id: orderDemandId,
      },
    })
      .then((order) => {
        res.redirect(`/order/${userId}`);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static updateOrder(req, res) {
    const { orderDemandId, userId } = req.params;
    OrderDemand.findByPk(orderDemandId, { include: ["Product"] })
      .then((order) => {
        const quantity = order.quantity + 1;
        const price = order.Product?.price * quantity;
        return OrderDemand.update(
          { quantity: quantity, price: price },
          {
            where: {
              id: orderDemandId,
            },
          }
        );
      })
      .then((order) => {
        res.redirect(`/order/detail/${userId}/${orderDemandId}`);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static readStocks(req, res) {
    Product.findAll({})
      .then((product) => {
        const formattedPrice = product.map((el) => {
          return Product.formatPrice(el.price);
        });
        res.render("Products", { product, formattedPrice });
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static addProductForm(req, res) {
    const { error } = req.query;
    res.render("AddProduct", { error });
  }
  static addProduct(req, res) {
    const { name, description, price, stock, rating, image, CategoryId } =
      req.body;

    Product.create({
      name,
      description,
      price,
      stock,
      rating,
      image,
      CategoryId,
    })
      .then(() => {
        res.redirect("/stocks");
      })
      .catch((err) => {
        const errors = err.errors.map((e) => e.message);
        res.redirect(`/products/add?error=${errors}`);
      });
  }
  static editProductForm(req, res) {
    const productId = req.params.id;
    const { error } = req.query;

    Product.findByPk(productId)
      .then((product) => {
        res.render("EditProduct", { product, error });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
  static editProduct(req, res) {
    const { productId } = req.params;
    const { name, description, price, stock, rating, image, CategoryId } =
      req.body;

    Product.update(
      { name, description, price, stock, rating, image, CategoryId },
      { where: { id: productId } }
    )
      .then(() => {
        res.redirect("/stocks");
      })
      .catch((err) => {
        const errors = err.errors.map((e) => e.message);
        res.redirect(`/products/add?error=${errors}`);
      });
  }

  static deleteProduct(req, res) {
    const productId = req.params.id;

    Product.destroy({ where: { id: productId } })
      .then(() => {
        res.redirect("/products");
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
}
module.exports = Controller;
