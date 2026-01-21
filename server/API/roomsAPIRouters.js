const express = require("express");
const { Room, RoomAdmission, RoomRequest, User } = require("../db/models"); // Импорт моделей из базы данных
const router = express.Router();

// Маршрут для создания новой комнаты
router.post("/", async (req, res) => {
  const { nameroom, isPrivate } = req.body; // Получаем данные из тела запроса
  try {
    const userID = req.session.userID; // Получаем ID пользователя из сессии

    // 1. Создаем новую комнату в базе данных
    const newRoom = await Room.create({
      nameroom,
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

    res.status(200).json(newRoom);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка при создании комнаты" });
  }
});

// Идея: вместе с каждой комнатой вернуть isOwner, isMember,
// myRequestStatus (статус моего запроса, если он есть).
// Тогда фронт поймёт, открывать модалку или сразу пускать в комнату.
router.get("/", async (req, res) => {
  try {
    // Забираем id из сессии
    const userID = req.session.userID;

    // ищем все комнаты
    const findAllRoom = await Room.findAll({
      // отдаем нужные аттрибуты
      attributes: ["id", "nameroom", "isPrivate", "ownerID"],
      // Мой запрос к комнатам (0..1)
      include: [
        {
          model: RoomRequest,
          required: false,
          where: userID ? { user_id: userID } : { user_id: null },
          attributes: ["id", "user_id", "room_id", "status"],
        },
        // В каких комнатах я являюсь участником
        // вычисляем isMember для каждой комнаты в одном запросе, без дополнительных обращений к базе данных.
        {
          // ассоциация с моделью User
          association: "members",
          attributes: ["id"],
          through: { attributes: [] },
          // required: true = INNER JOIN (только комнаты, где есть подходящий пользователь)
          // required: false = LEFT JOIN (все комнаты, даже если пользователя в них нет)
          required: false, // LEFT JOIN.
          where: userID ? { id: userID } : { id: null },
        },
      ],
      order: [["nameroom", "ASC"]],
    });

    const payload = findAllRoom.map((room) => {
      const json = room.get({ plain: true }); // room.toJSON();
      const isOwner = userID ? json.ownerID === Number(userID) : false;

      // проверка: нашелся ли текущий пользователь в массиве members?
      // isMember = false для комнат, где пользователь НЕ участник
      // isMember = true для комнат, где пользователь участник
      const isMember =
        (Array.isArray(json.members) && json.members.length > 0) || isOwner;
      const myRequestStatus =
        Array.isArray(json.RoomRequests) && json.RoomRequests.length > 0
          ? json.RoomRequests[0].status
          : null;

      let hasAccess;
      if (json.isPrivate === true) {
        hasAccess = isOwner || isMember || myRequestStatus === "accepted";
      } else {
        hasAccess = true; // открытая комната
      }

      // не тащим мусор на клиент
      delete json.members;
      delete json.RoomRequests;

      return { ...json, isOwner, isMember, myRequestStatus, hasAccess };
    });

    res.json(payload); // Отправляем  клиенту
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

// Маршрут для получения конкретной комнаты по её ID
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Получаем ID из параметров URL
  try {
    // Ищем комнату по ID
    const findRoomID = await Room.findOne({
      where: { id },
      include: [{ model: User, as: "owner", attributes: ["avatar"] }],
    });
    // вычисляем ко-во участников в данной комнате
    const acceptedCount = await RoomRequest.count({
      where: { room_id: id, status: "accepted" },
    });
    res.status(200).json({
      // ...findRoomID.toJSON(),
      ...findRoomID.get({ plain: true }),
      acceptedCount,
    }); // Отправляем найденную комнату клиенту
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Не удалось найти комнату" }); // Отправляем сообщение об ошибке
  }
});

module.exports = router; // Экспортируем маршруты для использования в основном приложении
