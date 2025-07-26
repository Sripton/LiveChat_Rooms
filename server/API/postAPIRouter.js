const express = require("express");
const { Room, Post } = require("../db/models");
const router = express.Router();

router.post("/:id", async (req, res) => {
  // Извлекаем параметр id из URL запроса
  const { id } = req.params;
  // Извлекаем поле postTitle из тела запроса
  const { postTitle } = req.body;
  try {
    // Получаем id пользователя из сессии
    const userID = req.session.userID;
    // Ищем объект Room по его первичному ключу (id)
    const findRoomID = await Room.findByPk(id);
    // Создаем новый пост, используя данные из запроса:
    // - posttitle: заголовок поста из тела запроса
    // - user_id: идентификатор пользователя, полученный из сессии
    // - room_id: идентификатор найденной комнаты
    const createPost = await Post.create({
      postTitle,
      user_id: userID,
      room_id: findRoomID.id,
    });
    // Отправляем созданный пост обратно клиенту в формате JSON
    res.json(createPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка при создании поста" });
  }
});

// Маршрут для получения списка всех постов
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Получаем ID из параметров URL
  try {
    const findAllPostsID = await Post.findAll({ where: { room_id: id } }); // Ищем все посты относящиеся к определенной комнате по ID
    res.json(findAllPostsID); // Отправляем все посты на клиент
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка при передачи постов" }); // Отправляем сообщение об ошибке
  }
});

module.exports = router;
