"use strict";

const fs = require("fs");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

let usersData = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
usersData.map((e) => {
  e.password = bcrypt.hashSync(e.password, salt);
  (e.createdAt = new Date()), (e.updatedAt = new Date());
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", usersData, {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
