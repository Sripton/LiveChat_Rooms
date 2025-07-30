const express = require("express");
const { Room, RoomRequest, RoomAdmission } = require("../db/models");
const router = express.Router();

// POST /api/room-requests — пользователь запрашивает доступ к комнате
router.post("/", async (req, res) => {
  const userID = req.session.userID;
  // sendNotification - управляется на клиенте
  // sendNotification - UI-флаг — пользователь может поставить/снять чекбокс "уведомить владельца".
  const { roomID = 2, ownerID, sendNotification } = req.body;

  try {
    // 1. Проверяем: действительно ли комната существует и принадлежит указанному владельцу
    const room = await Room.findByPk(roomID);
    if (!room || room.owner_id !== ownerID) {
      res.status(403).json({ message: "Неверный владелец комнаты" });
    }

    // 2. Проверка: уже существует такой запрос?
    const existingRequest = await RoomRequest.findOne({
      where: { userID, room_id: roomID, status: "pending" },
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Запрос уже отправлен." });
    }

    // 3. Создаём новый запрос
    const createRequest = await RoomRequest.create({
      user_id: userID,
      room_id: roomID,
      owner_id: ownerID,
      // status - default "pending"
    });

    // 4. Отправка уведомления (по желанию)
    if (sendNotification) {
      console.log(
        `📩 Уведомление владельцу ${ownerID}: пользователь ${userID} просит доступ к комнате ${roomID}`
      );
    }
    res
      .status(200)
      .json({ message: "Запрос на доступ отправлен", request: createRequest });
  } catch (error) {
    console.error("Ошибка при создании запроса доступа:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Одобрение запроса (например, админом)
router.post("/approve", async (req, res) => {
  const { requestId } = req.body;
  try {
    const request = await RoomRequest.findByPk(requestId);
    if (!request) return res.status(404).json({ message: "Запрос не найден" });

    // Создаём доступ
    await RoomAdmission.create({
      user_id: request.user_id,
      room_id: request.room_id,
    });

    // Обновляем статус запроса
    request.status = "approved";
    await request.save();
    res.status(200).json({ message: "Доступ предоставлен" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при одобрении запроса" });
  }
});

module.exports = router;
