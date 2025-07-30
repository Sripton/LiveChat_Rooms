"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Room }) {
      // define association here
      this.belongsTo(User, { foreignKey: "user_id", as: "requester" }); // кто просит доступ
      this.belongsTo(User, { foreignKey: "owner_id", as: "owner" }); //  кто владелец комнаты
      this.belongsTo(Room, { foreignKey: "room_id" }); // к какой комнате
    }
  }
  RoomRequest.init(
    {
      user_id: DataTypes.INTEGER,
      room_id: DataTypes.INTEGER,
      owner_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RoomRequest",
    }
  );
  return RoomRequest;
};
