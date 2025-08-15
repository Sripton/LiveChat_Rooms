const express = require("express");
const { Room, RoomAdmission } = require("../db/models"); // Импорт моделей из базы данных
const router = express.Router();

// Маршрут для создания новой комнаты
router.post("/", async (req, res) => {
  const { nameroom, description, isPrivate } = req.body; // Получаем данные из тела запроса
  try {
    const userID = req.session.userID; // Получаем ID пользователя из сессии

    // 1. Создаем новую комнату в базе данных
    const newRoom = await Room.create({
      nameroom,
      description,
      isPrivate,
      ownerID: userID,
    });

    // 2. Если комната приватная — добавляем владельца в список допущенных (RoomAdmission)
    if (isPrivate) {
      await RoomAdmission.create({
        user_id: userID,
        room_id: newRoom.id,
      });
    }
    // 3. Возвращаем клиенту созданную комнату
    res.status(200).json(newRoom);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка при создании комнаты" });
  }
});

// Маршрут для получения списка всех комнат
router.get("/", async (req, res) => {
  try {
    const findAllRoom = await Room.findAll(); // Получаем все комнаты из базы данных
    res.json(findAllRoom); // Отправляем их клиенту
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка сервера" }); // Отправляем сообщение об ошибке клиенту
  }
});

router.get("/userRooms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const allRooomsUser = await Room.findAll({ where: { ownerID: id } });
    res.status(200).json(allRooomsUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при получении доступных комнат" });
  }
});

// router.get("/available", async (req, res) => {
//   try {
//     const userID = req.session.userID;
//     // Все комнаты, в которые пользователь имеет доступ
//     const rooms = await Room.findAll({
//       include: [
//         { model: RoomAdmission, as: "admissions", where: { user_id: userID } },
//       ],
//     });

//     res.json(rooms);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Ошибка при получении доступных комнат" });
//   }
// });

// Маршрут для получения конкретной комнаты по её ID
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Получаем ID из параметров URL
  try {
    const findRoomID = await Room.findOne({ where: { id } }); // Ищем комнату по ID
    res.status(200).json(findRoomID); // Отправляем найденную комнату клиенту
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Не удалось найти комнату" }); // Отправляем сообщение об ошибке
  }
});

module.exports = router; // Экспортируем маршруты для использования в основном приложении
