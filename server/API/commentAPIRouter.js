const express = require("express");
const { Post, Comment, User } = require("../db/models");
const { fn, col, Op } = require("sequelize");
const router = express.Router();

router.post("/counts", async (req, res) => {
  try {
    // Проверка Array.isArray(req.body.postIds) → если это массив, то берём его, чистим, превращаем в новый массив чисел без дублей.
    const postIds = Array.isArray(req.body.postIds)
      ? [...new Set(req.body.postIds.map(Number).filter(Number.isFinite))]
      : []; // Если это не массив

    // если «массив пуст» → сразу отдаём { counts: {} }.
    if (!postIds.length) return res.json({ counts: {} });

    const rows = await Comment.findAll({
      attributes: ["post_id", [fn("COUNT", col("id")), "count"]],
      // [
      //   {
      //     "post_id": 1,
      //     "count": "5"
      //   }
      // ]
      where: { post_id: { [Op.in]: postIds } },
      group: ["post_id"],
      raw: true,
    });
    const counts = Object.fromEntries(postIds.map((id) => [id, 0]));
    rows.forEach((r) => (counts[r.post_id] = Number(r.count)));
    res.json({ counts });
  } catch (error) {
    console.log(error);
  }
});
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

    // как варинт на сервере отдавать полный коммнетрий с пользователем
    // дочитываем с включенным пользователем
    const fullComment = await Comment.findByPk(createComment.id, {
      include: [
        { model: User, attributes: ["id", "name", "avatar", "updatedAt"] },
      ],
    });
    // Отправляем  комментарий на клиент
    res.status(201).json(fullComment);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  // id - строка
  const { id } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { post_id: id },
      include: [{ model: User }],
    });
    res.status(200).json({ comments });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
