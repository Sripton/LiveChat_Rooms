"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Room,
      RoomAdmission,
      RoomRequest,
      Postreaction,
      Comment,
    }) {
      // define association here
      this.hasMany(Room, { foreignKey: "ownerID", as: "ownedRooms" });
      this.belongsToMany(Room, {
        through: RoomAdmission, // имя промежуточной таблицы
        as: "privateRooms", // название доступа к комнатам от user
        foreignKey: "user_id", // поле, указывающее на User
        otherKey: "room_id", // поле, указывающее на Room
      });
      this.hasMany(RoomRequest, { foreignKey: "user_id" });
      this.hasMany(Postreaction, { foreignKey: "user_id" });
      this.hasMany(Comment, { foreignKey: "user_id" });
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
