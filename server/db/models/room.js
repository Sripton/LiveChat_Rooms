"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, RoomAdmission, RoomAccesses }) {
      // define association here
      this.belongsTo(User, { foreignKey: "ownerID", as: "owner" });
      this.belongsToMany(User, {
        through: RoomAdmission, // имя промежуточной таблицы
        as: "members", // название доступа к пользователям из комнаты
        foreignKey: "room_id", // поле, указывающее на Room
        otherKey: "user_id", // поле, указывающее на User
      });
    }
  }
  Room.init(
    {
      nameroom: DataTypes.STRING,
      description: DataTypes.STRING,
      isPrivate: DataTypes.BOOLEAN,
      ownerID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Room",
    }
  );
  return Room;
};
