'use strict';

const fs = require("fs");
let categoriesData = JSON.parse(fs.readFileSync("./data/categories.json", "utf-8"));
categoriesData.map(e => {
  delete e.id,
    e.createdAt = new Date(),
    e.updatedAt = new Date()
})

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', categoriesData, {});
    /**
     * Add seed commands here.
     *
     * Example:
     *
    */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
