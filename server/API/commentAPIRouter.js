const express = require("express");
const { Post, Comment } = require("../db/models");
const { fn, col, Op } = require("sequelize");
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

router.post("/counts", async (req, res) => {
  try {
    const postIds = Array.isArray(req.body.postIds)
      ? [...new Set(req.body.postIds.map(Number).filter(Number.isFinite))]
      : [];
    if (!postIds.length) return res.json({ counts: {} });

    const rows = await Comment.findAll({
      attributes: ["post_id", [fn("COUNT", col("id")), "count"]],
      where: { post_id: { [Op.in]: postIds } },
      group: ["post_id"],
      raw: true,
    });
    const counts = Object.fromEntries(postIds.map((id) => [id, 0]));
    rows.forEach((r) => {
      counts[r.post_id] = Number(r.count);
    });

    res.set("Cache-Control", "public, max-age=15");
    res.json({ counts });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  // id - строка
  const { id } = req.params;
  try {
    const comments = await Comment.findAll({ where: { post_id: id } });
    res.status(200).json({ comments });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
