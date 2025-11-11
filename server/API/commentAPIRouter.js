const express = require("express");
const { Post, Comment, User } = require("../db/models");
const { fn, col, Op } = require("sequelize");
const router = express.Router();
const { checkUserForComment } = require("../MiddleWares/checkUser");

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

// Отдаём последние ответы, адресованные пользователю:
router.get("/notifications/replies", async (req, res) => {
  try {
    const userID = Number(req.session.userID); // userId (обязательный) - ID пользователя, для которого получаем уведомления

    if (!Number.isInteger(userID)) {
      return res.status(400).json({ message: "userId must be an integer" });
    }
    const limit = Math.min(Number(req.query.limit) || 50, 200); // limit (по необходимости) - максимальное количество записей (макс. 200)
    const before = req.query.before ? new Date(req.query.before) : new Date(); // "2025-10-28T08:31:03.547Z"

    // Условие: это комментарии НЕ текущего юзера,
    // которые либо ответы к постам юзера, либо являются ответами на его комментарии.
    const rows = await Comment.findAll({
      subQuery: false, // важно в некоторых версиях
      distinct: true, // чтобы limit считался по Comment, а не по join-строкам
      where: {
        user_id: { [Op.ne]: userID }, // Не ответы самого пользователя
        // createdAt - это поле даты/времени создания записи в базе данных
        // [Op.lt] - оператор Sequelize для "less than" (меньше чем)
        // before - это дата, до которой мы хотим получить записи
        createdAt: { [Op.lt]: before }, // Это означает: "выбрать все комментарии, созданные ДО
        // [Op.or]: [
        //   // 1) Верхнеуровневый коммент к моему посту — это "ответ на мой пост"
        //   {
        //     [Op.and]: [{ parent_id: null }, { "$Post.user_id$": userID }],
        //   },
        //   { "$ParentComment.user_id$": userID },
        // ],
      },
      include: [
        {
          model: Post,
          required: false,
          attributes: ["id", "user_id", "room_id"],
        },
        // Родительский комментарий, если это ответ
        {
          model: Comment,
          as: "ParentComment", // ВАЖНО: алиас совпадает с where "$ParentComment.user_id$"
          required: false,
          attributes: ["id", "user_id"],
        },
        {
          model: User, // автор текущего комментария
          attributes: ["id", "name", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    });

    // Фильтрация. Отдаем только коммнетарии к постам и комментариям
    const result = rows.filter(
      (comment) =>
        (comment.user_id !== userID &&
          comment.ParentComment === null &&
          comment?.Post?.user_id === userID) ||
        comment.ParentComment?.user_id === userID
    );

    res.json({
      items: result,
      // nextBefore хранит время последнего элемента, чтобы следующая подгрузка получила ещё более старые ответы.
      nextBefore: result.length ? result[result.length - 1].createdAt : null, // nextBefore = createdAt последнего  элемента.
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при получении ответов" });
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

router.patch("/:id", checkUserForComment, async (req, res) => {
  const { id } = req.params;
  const { commentTitle } = req.body;
  try {
    const comment = await Comment.findByPk(id);
    if (!comment)
      return res.status(404).json({ message: "Коммнетрий не оюнаружен" });
    await comment.update({ commentTitle });
    res.status(200).json(comment); // возвращаем обновлённый комментарий
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", checkUserForComment, async (req, res) => {
  const { id } = req.params;
  try {
    // Ищем комментарий по его id
    const comment = await Comment.findByPk(id);
    // Если коммнетрия нет. Выводим ошибку
    if (!comment) {
      return res.status(404).json({ message: "Комментарий не найден" });
    }
    // const commentReplies = await Comment.findAll({ where: { parent_id: id } });
    // Удаляем все ответы на данный коммнетрий
    await Comment.destroy({ where: { parent_id: id } });

    // Удаляем сам коммнетрий
    await Comment.destroy({ where: { id } });
    return res.status(200).json({ id });
  } catch (error) {
    console.error("Ошибка при удалении комментария:", error);
    return res.status(500).json({ message: "Ошибка сервера-----" });
  }
});

module.exports = router;
