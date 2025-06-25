const express = require("express");
const { User } = require("../db/models");
const bcrypt = require("bcrypt");
const router = express.Router();

// Обработчик POST-запроса на маршрут "/signup" для регистрации пользователя

router.post("/signup", async (req, res) => {
  const { login, password, name } = req.body;
  try {
    // Хэширование пароля:
    // 10 количество раундов хэширования (чем больше, тем сложнее взломать, но это увеличивает время обработки).
    const hashPassword = await bcrypt.hash(password, 10);

    //  Создание пользователя:
    const createUsers = await User.create({
      login,
      password: hashPassword,
      name,
    });

    // Сохранение данных в сессии:
    // После успешного создания пользователя его данные сохраняются в объекте сессии:
    req.session.userID = createUsers.id;
    req.session.userName = createUsers.name;

    //  Ответ клиенту: На клиент возвращается JSON-объект с идентификатором и именем пользователя.
    res.json({
      userID: createUsers.id,
      userName: createUsers.name,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
