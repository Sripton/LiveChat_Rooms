const { Post, Comment } = require("../db/models");
async function checkUserForPost(req, res, next) {
  // Получаем ID поста из параметров запроса
  const { id } = req.params;
  // Получаем ID пользователя из сессии
  const userID = req.session.userID;
  try {
    // Ищем пост по его ID в базе данных
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    // Если пользователь не является владельцем поста, отправляем 403 (Forbidden)
    if (userID !== post.user_id) {
      return res.status(403).json({
        message: "Доступ запрещен: вы не являетесь владельцем этого сообщения",
      });
    }

    // Если все проверки пройдены, передаем управление следующему middleware
    next();
  } catch (error) {
    // Логируем ошибку и отправляем 500 (Internal Server Error)
    console.log(error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
}

async function checkUserForComment(req, res, next) {
  const { id } = req.params;
  const userID = req.session.userID;
  try {
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: "Комментарий не найден" });
    }
    if (userID !== comment.user_id) {
      return res.status(403).json({
        message: "Доступ запрещен: вы не являетесь владельцем этого сообщения",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
}

module.exports = { checkUserForPost, checkUserForComment };
