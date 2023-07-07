'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserProfile.belongsTo(models.User);
    }
  }
  UserProfile.init({
    firstName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: { msg: "First Name is required" },
        notNull: { msg: "First Name is required" }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Last Name is required" },
        notNull: { msg: "Last Name is required" }
      }
    },
    address: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Address is required" },
        notNull: { msg: "Address is required" }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Phone Number is required" },
        notNull: { msg: "Phone Number is required" },
        len: {
          args: [10, 13],
          msg: "Minimal Phone Number 10 and maksimal 13"
        }
      }
    },
    profilePicture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserProfile',
  });
  return UserProfile;
};