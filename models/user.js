"use strict";
const { Model } = require("sequelize");

const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.OrderDemand);
      User.hasMany(models.UserProfile);
    }
  }
  User.init(
    {
      userName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: { msg: "UserName is required" },
          notNull: { msg: "UserName is required" },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: { msg: "E-mail is required" },
          notNull: { msg: "E-mail is required" },
          isEmail: { msg: "Please input with correct email format" },
        },
      },
      password: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password is required" },
          notNull: { msg: "Password is required" },
          len: {
            args: [6, 10],
            msg: "Password must be 6-10 character",
          },
        },
      },
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate((user, options) => {
    user.role = "user";
  });
  User.beforeSave((user, options) => {
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
  });

  return User;
};
