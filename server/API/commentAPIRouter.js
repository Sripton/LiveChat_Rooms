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

    if (!userID)
      return res
        .status(401)
        .json({ message: "Пользователь не зарегистрирован" });

    // Ищем пост под которым хотим оставить комменатрий
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: "Пост не найден" });

    let parent = null;

    // Если parentID передан
    if (parentID) {
      // Ищем коммнетрий по parent_id
      parent = await Comment.findByPk(parentID);
      if (!parent)
        return res.status(400).json({ message: "Коммнетрий не найден" });
      if (parent.post_id !== post.id) {
        return res.status(400).json({ message: "Принадоежит к другому посту" });
      }
    }

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
        {
          model: Comment,
          as: "ParentComment",
          attributes: ["id", "commentTitle", "createdAt", "user_id", "post_id"],
          include: [{ model: User, attributes: ["id", "name", "avatar"] }],
          required: false, // чтобы не «терять» ответ при отсутствии родителя
        },
      ],
    });
    // Отправляем  комментарий на клиент
    res.status(201).json(fullComment);

    // чтобы не таскать глубокие вложенности:
    // res.json({
    //   id: fullComment.id,
    //   commentTitle: fullComment.commentTitle,
    //   user: fullComment.User,
    //   parent: fullComment.ParentComment
    //     ? {
    //         id: fullComment.ParentComment.id,
    //         authorName: fullComment.ParentComment.User?.name ?? null,
    //       }
    //     : null,
    // });
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
      order: [["createdAt", "ASC"]],
      include: [
        { model: User },
        {
          model: Comment,
          as: "ParentComment",
          attributes: ["id", "commentTitle", "createdAt", "user_id", "post_id"],
          include: [{ model: User, attributes: ["id", "name", "avatar"] }],
          required: false,
        },
      ],
    });
    res.status(200).json({ comments });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
