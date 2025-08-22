const express = require("express");
const {
  Room,
  RoomRequest,
  RoomAdmission,
  User,
  sequelize,
} = require("../db/models");

const router = express.Router();

// POST /api/room-requests — пользователь запрашивает доступ к комнате
router.post("/", async (req, res) => {
  const { roomID } = req.body;
  try {
    // 1. Проверяем действительно ли пользователь авторизован
    const userID = req.session.userID;
    if (!userID) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }

    // 2. Проверяем: действительно ли комната существует и принадлежит указанному владельцу
    const room = await Room.findByPk(roomID);
    if (!room || !room.isPrivate) {
      return res
        .status(404)
        .json({ message: "Комната не найдена или не приватная" });
    }

    // 3. Проверка: уже существует такой запрос?
    const existingRequest = await RoomRequest.findOne({
      where: {
        user_id: userID,
        room_id: roomID,
        owner_id: room.ownerID,
        status: "pending",
      },
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Запрос уже отправлен." });
    }

    // 4. Создаём новый запрос
    const createRequest = await RoomRequest.create({
      user_id: userID,
      room_id: roomID,
      owner_id: room.ownerID,
      status: "pending",
    });

    res
      .status(200)
      .json({ message: "Запрос на доступ отправлен", request: createRequest });
  } catch (error) {
    console.error("Ошибка при создании запроса доступа:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.get("/userRequest/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Исходяшщие запросы пользователя
    const outgoing = await RoomRequest.findAll({
      where: { user_id: id },
      order: [["createdAt", "DESC"]],
      include: [{ model: Room, attributes: ["nameroom"] }],
    });
    // Входящие запросы пользователя
    const incoming = await RoomRequest.findAll({
      where: { owner_id: id },
      order: [["createdAt", "DESC"]],
      include: [
        { model: User, as: "requester", attributes: ["name", "avatar"] },
        { model: Room, attributes: ["nameroom"] },
      ],
    });
    res.status(200).json({ outgoing, incoming });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ messageError: "Ошибка при получении запросов пользователя:" });
  }
});

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

router.patch("/changeRequestStatus/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    // текущий пользователь
    const userID = 1;
    if (!userID) throw httpError(401, "Пользователь не авторизован");

    // Все запросы внутри этого блока выполняются либо все вместе, либо ни один.
    // Если где-то выбросится ошибка → транзакция откатывается.
    await sequelize.transaction(async (t) => {
      // 2) читаем и блокируем строку запроса
      const request = await RoomRequest.findByPk(id, {
        transaction: t, //  запрос выполняется внутри этой транзакции.
        lock: t.LOCK.UPDATE, // накладываем блокировку на строку в базе (чтобы другой админ/процесс не смог параллельно её менять).
        // Это важно, если двое одновременно обрабатывают один и тот же запрос.
      });
      if (!request) throw httpError(404, "Запрос не найден");

      // 3) проверка прав — менять может только владелец комнаты
      if (request.owner_id !== userID) {
        throw httpError(403, "Вы не являетесь владельцем комнаты");
      }
      // Меняем статус (именно внутри транзакции!)
      // Если статус отличается от текущего → обновляем.
      // Это нужно, чтобы не получилась ситуация статус = accepted, но участник не добавлен
      if (request.status !== status) {
        await request.update({ status }, { transaction: t });
      }

      // При accepted — гарантированно и один раз выдаём доступ
      // Если запрос принят → добавляем запись в RoomAdmission.
      if (status === "accepted") {
        await RoomAdmission.findOrCreate({
          // findOrCreate гарантирует, что запись не будет продублирована (создаст новую только если нет такой пары user_id + room_id).
          where: { user_id: request.user_id, room_id: request.room_id },
          defaults: { user_id: request.user_id, room_id: request.room_id },
          transaction: t,
        });
      }
    });

    // 4) отдаем обновлённый запрос с включениями
    const updated = await RoomRequest.findByPk(id, {
      include: [
        { model: User, as: "requester", attributes: ["id", "name", "avatar"] },
        { model: User, as: "owner", attributes: ["id", "name"] },
        { model: Room, attributes: ["id", "nameroom", "ownerID"] },
      ],
    });

    res.status(200).json({ message: "Запрос обновлён", request: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при одобрении запроса" });
  }
});

// // Одобрение запроса (например, админом)
// router.post("/approve", async (req, res) => {
//   const { requestId } = req.body;
//   try {
//     const request = await RoomRequest.findByPk(requestId);
//     if (!request) return res.status(404).json({ message: "Запрос не найден" });

//     // Создаём доступ
//     await RoomAdmission.create({
//       user_id: request.user_id,
//       room_id: request.room_id,
//     });

//     // Обновляем статус запроса
//     request.status = "approved";
//     await request.save();
//     res.status(200).json({ message: "Доступ предоставлен" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Ошибка при одобрении запроса" });
//   }
// });

module.exports = router;
