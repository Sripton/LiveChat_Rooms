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

router.post("/signin", async (req, res) => {
  const { login, password } = req.body;
  try {
    // Ищем пользователя в базе данных по логину
    const findUserLogin = await User.findOne({ where: { login } });

    // Если пользователь найден, сравниваем введённый пароль с хэшем в базе данных
    const comparePassword = await bcrypt.compare(
      password,
      findUserLogin.password
    );

    // Если пароль верный, сохраняем ID и имя пользователя в сессии
    if (comparePassword) {
      req.session.userID = findUserLogin.id;
      req.session.userName = findUserLogin.name;
    }
    // Отправляем клиенту ID и имя пользователя
    res.json({
      userID: findUserLogin.id,
      userName: findUserLogin.name,
    });
  } catch (error) {
    console.log(error);
  }
});

// Обработчик GET-запроса на маршрут "/checkUser" для проверки авторизованного пользователя
router.get("/checkuser", (req, res) => {
  try {
    // Проверяем, есть ли userID в сессии (то есть, авторизован ли пользователь)
    if (req.session.userID) {
      // Если пользователь авторизован, отправляем его ID и имя
      return res.json({
        userID: req.session.userID,
        userName: req.session.userName,
      });
    }
    // Если пользователь не авторизован, отправляем статус 401 (Unauthorized)
    return res.status(401).json({ message: "Пользователь не авторизован" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});
module.exports = router;
