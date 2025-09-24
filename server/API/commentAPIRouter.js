const express = require("express");
const { Post, Comment } = require("../db/models");
const router = express.Router();

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { commentTitle, parentID } = req.body;
  try {
    // Забираем сессию пользователя
    const userID = req.session.userID;
    // Ищем пост под которым хотим оставить комменатрий
    const post = await Post.findByPk(id);
    // Создаем новый комментарий
    const createComment = await Comment.create({
      commentTitle, // Текст комментария
      user_id: userID, // ID пользователя из сессии
      post_id: post.id, // ID поста, к которому относится комментарийs
      parent_id: parentID || null, // Если это ответ — сохраняем parent_id, иначе null
    });
    // Отправляем  комментарий на клиент
    res.status(201).json(createComment);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findAll({ where: { post_id: id } });
    res.status(200).json(comment);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
