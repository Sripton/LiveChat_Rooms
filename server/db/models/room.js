"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, RoomAdmission, RoomRequest }) {
      // define association here
      this.belongsTo(User, { foreignKey: "ownerID", as: "owner" });

      //  связь "многие ко многим": один Room может иметь много User, и один User может быть в нескольких Room.
      this.belongsToMany(User, {
        // Эта связь идёт через промежуточную таблицу RoomAdmission, где хранятся пары room_id + user_id.
        through: RoomAdmission, // имя промежуточной таблицы
        as: "members", // название доступа к пользователям из комнаты
        foreignKey: "room_id", // поле, указывающее на Room
        otherKey: "user_id", // поле, указывающее на User
      });
      // С  belongsToMany можно делать запросы типа:
      //       const room = await Room.findByPk(1, {
      //   include: [{ model: User, as: "members" }],
      // });

      // Без belongsToMany
      // const admissions = await RoomAdmission.findAll({ where: { room_id: 1 } });
      // const users = await User.findAll({ where: { id: admissions.map(a => a.user_id) } });
      this.hasMany(RoomAdmission, { foreignKey: "room_id", as: "admissions" });
      this.hasMany(RoomRequest, { foreignKey: "room_id" });
    }
  }
  Room.init(
    {
      nameroom: DataTypes.STRING,
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
