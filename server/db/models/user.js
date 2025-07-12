"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Room, RoomAccess }) {
      // define association here
      this.hasMany(Room, { foreignKey: "ownerID", as: "ownedRooms" });
      this.belongsToMany(Room, {
        through: RoomAccess, // имя промежуточной таблицы
        as: "privateRooms", // название доступа к комнатам от user
        foreignKey: "user_id", // поле, указывающее на User
        otherKey: "room_id", // поле, указывающее на Room
      });
    }
  }
  User.init(
    {
      login: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
