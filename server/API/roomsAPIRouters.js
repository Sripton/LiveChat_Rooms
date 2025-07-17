const express = require("express");
const { Room, RoomAdmission } = require("../db/models");
const router = express.Router();

router.post("/", async (req, res) => {
  const { nameroom, description, isPrivate } = req.body;
  try {
    const userID = req.session.userID;

    // 1. Создаем комнату
    const newRoom = await Room.create({
      nameroom,
      description,
      isPrivate,
      ownerID: userID,
    });

    // 2. Если комната приватная — добавляем создателя в RoomAccess
    if (isPrivate) {
      await RoomAdmission.create({
        user_id: userID,
        room_id: newRoom.id,
      });
    }
    // 3. Возвращаем созданную комнату
    res.status(200).json(newRoom);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка при создании комнаты" });
  }
});

router.get("/", async (req, res) => {
  try {
    const findAllRoom = await Room.findAll();
    res.json(findAllRoom);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
