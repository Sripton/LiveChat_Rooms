"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomAccess extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Room }) {
      // define association here
      // напрямую получать данные через include.
      this.belongsTo(User, { foreignKey: "user_id" });
      this.belongsTo(Room, { foreignKey: "room_id" });
    }
  }
  RoomAccess.init(
    {
      user_id: DataTypes.INTEGER,
      room_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RoomAccess",
    }
  );
  return RoomAccess;
};
