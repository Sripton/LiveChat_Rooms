const express = require("express");
const { Room, Post, User, Postreaction } = require("../db/models");
const router = express.Router();
const { checkUserForPost } = require("../MiddleWares/checkUser");

router.post("/:id", async (req, res) => {
  // Извлекаем параметр id из URL запроса
  const { id } = req.params;
  // Извлекаем поле postTitle из тела запроса
  const { postTitle } = req.body;

  if (!postTitle) {
    return res.status(400).json({ message: "Заголовок не может быть пустым" });
  }
  try {
    // Получаем id пользователя из сессии
    const userID = req.session.userID;
    if (!userID)
      return res.status(401).json({ message: "Необходима авторизация." });

    // Ищем объект Room по его первичному ключу (id)
    const findRoomID = await Room.findByPk(id);
    if (!findRoomID)
      return res.status(404).json({ message: "Комната не найдена." });
    // Создаем новый пост, используя данные из запроса:
    // - posttitle: заголовок поста из тела запроса
    // - user_id: идентификатор пользователя, полученный из сессии
    // - room_id: идентификатор найденной комнаты
    const createPost = await Post.create({
      postTitle,
      user_id: userID,
      room_id: findRoomID.id,
    });

    // Дочитываем пост с включённым автором
    const postWithAuthor = await Post.findByPk(createPost.id, {
      include: [{ model: User, attributes: ["id", "name", "avatar"] }],
    });
    // Отправляем созданный пост обратно клиенту в формате JSON
    res.json(postWithAuthor);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка при создании поста" });
  }
});

// Маршрут для получения списка всех постов
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Получаем ID из параметров URL
  try {
    // const userID = req.session.userID;
    // Ищем все посты относящиеся к определенной комнате по ID
    const findAllPostsID = await Post.findAll({
      where: { room_id: id },
      include: [{ model: User, attributes: ["id", "name", "avatar"] }],
    });
    res.json(findAllPostsID); // Отправляем все посты на клиент
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка при передачи постов" }); // Отправляем сообщение об ошибке
  }
});

router.patch("/:id", checkUserForPost, async (req, res) => {
  const { id } = req.params;
  const { postTitle } = req.body;
  try {
    const post = await Post.findByPk(id);
    if (!post) return;
    await post.update({ postTitle });
    res.status(200).json(post); // ← вернуть сам объект поста
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ошибка при изменении поста" });
  }
});

router.delete("/:id", checkUserForPost, async (req, res) => {
  const { id } = req.params;
  try {
    // Удаляем все  реакции на пост
    await Postreaction.destroy({ where: { post_id: id } });

    // Находим сам пост
    const post = await Post.destroy({ where: { id } });
    //  Если поста нет. Выводим ошибку
    if (!post) {
      // ничего не удалилось → поста не было
      return res.status(404).json({ message: "Пост не найден" });
    }
    // для подстверждения  удаления:
    return res.status(200).json({ id });
  } catch (error) {
    console.error("Ошибка при удалении поста:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
