"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "Rooms",
      [
        {
          nameroom: "Эльмар создал вторую комнату",
          description: "222222222222",
          isPrivate: false,
          ownerID: 1,
        },
        {
          nameroom: "Эльмар создал привтаную  комнату - 2",
          description: "222222222222",
          isPrivate: true,
          ownerID: 1,
        },
        {
          nameroom: "Эльмар создал привтаную комнату - 3",
          description: "222222222222",
          isPrivate: true,
          ownerID: 1,
        },
        {
          nameroom: "Наза создала  комнату",
          description: "222222222222",
          isPrivate: false,
          ownerID: 2,
        },
        {
          nameroom: "Наза создала привтаную  комнату",
          description: "222222222222",
          isPrivate: true,
          ownerID: 2,
        },
        {
          nameroom: "Наза создала привтаную  комнату - 2",
          description: "222222222222",
          isPrivate: true,
          ownerID: 2,
        },
        {
          nameroom: "Фарид создал  комнату",
          description: "222222222222",
          isPrivate: false,
          ownerID: 3,
        },
        {
          nameroom: "Фарид создал привтаную  комнату",
          description: "222222222222",
          isPrivate: true,
          ownerID: 3,
        },
        {
          nameroom: "Фарид создал привтаную  комнату - 2",
          description: "222222222222",
          isPrivate: true,
          ownerID: 3,
        },
        {
          nameroom: "Фарид создал привтаную  комнату - 3",
          description: "222222222222",
          isPrivate: true,
          ownerID: 3,
        },
        {
          nameroom: "Рамина создала привтаную  комнату",
          description: "222222222222",
          isPrivate: true,
          ownerID: 4,
        },
        {
          nameroom: "Рамина создала привтаную  комнату - 2",
          description: "222222222222",
          isPrivate: true,
          ownerID: 4,
        },
        {
          nameroom: "Рамина создала привтаную  комнату - 3",
          description: "222222222222",
          isPrivate: true,
          ownerID: 4,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
