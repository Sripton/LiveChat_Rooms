const express = require("express");
const { User } = require("../db/models");
const bcrypt = require("bcrypt");
const router = express.Router();
const upload = require("../MiddleWares/upload");
const path = require("path");
const fs = require("fs").promises;
const fsSync = require("fs");
// Обработчик POST-запроса на маршрут "/signup" для регистрации пользователя

router.post("/signup", async (req, res) => {
  const { login, password, name } = req.body;
  try {
    // Проверяем, существует ли пользователь с таким логином
    const existingUserLogin = await User.findOne({ where: { login } });
    if (existingUserLogin) {
      return res
        .status(400)
        .json({ error: "Пользователь с таким логином уже существует" });
    }

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

// upload.single("avatar") — это middleware, который:
// ожидает одно поле с именем avatar;
// сохраняет загруженный файл в папку public/usersimg;
// в объект req.file кладёт информацию о файле (имя, путь и т.п.).

// router.patch("/uploadprofile", upload.single("avatar"), async (req, res) => {
//   const { name } = req.body;
//   try {
//     const userID = req.session.userID;
//     const user = await User.findOne({ where: { id: userID } });
//     if (!user) {
//       return res.status(404).json({ message: "Пользователь не найден" });
//     }

//     // Обновляем имя, если оно передано
//     if (name && name.trim() !== "") {
//       user.name = name.trim();
//     }

//     // Обновляем аватар, если файл был загружен
//     if (req.file) {
//       user.avatar = `/usersimg/${req.file.filename}`;
//     }

//     await user.save();
//     req.session.userName = user.name;
//     req.session.userAvatar = user.avatar;

//     // Если нужно — сохраняем сессию вручную
//     req.session.save((err) => {
//       if (err) {
//         console.error("Ошибка при сохранении сессии:", err);
//         return res.status(500).json({ message: "Ошибка сохранения сессии" });
//       }

//       res.json({
//         userName: user.name,
//         userAvatar: user.avatar,
//       });
//     });
//   } catch (error) {
//     console.error("Ошибка при обновлении профиля:", error);
//     res.status(500).json({ message: "Внутренняя ошибка сервера" });
//   }
// });

router.patch(`/uploadprofile`, upload.single("avatar"), async (req, res) => {
  const { name } = req.body;
  const removeOldAvatarSafe = async (avatarPath) => {
    try {
      if (!avatarPath) return; // ничего не удаляем

      // Защита: удаляем только файлы внутри /usersimg/.
      // Если по какой-то причине в БД лежит другой путь — игнорируем.
      if (!avatarPath.startsWith("/usersimg/")) return;

      // const absPath = path.join(
      //   __dirname,
      //   "../public/usersimg",
      //   `/${avatarPath}`
      // );

      // Собираем абсолютный путь до файла, который лежит в ../public/usersimg
      // avatarPath хранится с начальным слешем ("/usersimg/..."),
      // поэтому добавляем точку перед ним, чтобы path.resolve корректно соединил.
      const absPath = path.resolve(__dirname, "../public", `.${avatarPath}`); // path.resolve() - Преобразует относительные пути в абсолютные. Склеивает части пути правильно для текущей ОС

      // Проверяем существование файла перед удалением
      if (fsSync.existsSync(absPath)) {
        await fs.unlink(absPath); // удаляем файл
      }
    } catch (error) {
      console.log(error);
    }
  };

  //  id текущего пользователя из сессии
  const userID = req.session.userID;

  // Ищем пользователя в БД
  const user = await User.findOne({ where: { id: userID } });
  if (!user) {
    return res.status(404).json({ message: "Пользователь не найден" });
  }

  // Запоминаем текущий (старый) путь к аватару, чтобы после обновления удалить файл
  const oldAvatar = user.avatar;

  // Если прислали новое имя — обрежем пробелы и сохраним
  if (name && name.trim() !== "") {
    user.name = name.trim();
  }

  // Если через multer пришёл файл — формируем относительный путь и сохраняем в БД
  if (req.file) {
    user.avatar = `/usersimg/${req.file.filename}`;
  }

  // Сохраняем изменения пользователя в БД
  await user.save();

  // Обновляем данные в сессии (чтобы UI сразу видел новое имя/аватар)
  req.session.userName = user.name;
  req.session.userAvatar = user.avatar;

  // Если действительно загрузили новый файл (req.file есть)
  // и старый путь отличен от нового — удаляем старый файл
  if (req.file && oldAvatar && oldAvatar !== user.avatar) {
    await removeOldAvatarSafe(oldAvatar);
  }

  // Явно сохраняем сессию (если ваша конфигурация этого требует)
  req.session.save((err) => {
    if (err) {
      console.error("Ошибка при сохранении сессии:", err);
      return res.status(500).json({ message: "Ошибка сохранения сессии" });
    }

    // Отправляем клиенту актуальные данные пользователя
    res.json({
      userName: user.name,
      userAvatar: user.avatar,
    });
  });
});

// Обработчик GET-запроса на маршрут "/checkUser" для проверки авторизованного пользователя
router.get("/checkuser", async (req, res) => {
  try {
    const userID = req.session.userID;
    const findUser = await User.findOne({ where: { id: userID } });
    // Проверяем, есть ли userID в сессии (то есть, авторизован ли пользователь)
    if (userID) {
      // Если пользователь авторизован, отправляем его ID и имя
      return res.json({
        userID: req.session.userID,
        userName: req.session.userName,
        userAvatar: findUser.avatar,
      });
    }
    // Если пользователь не авторизован, отправляем статус 401 (Unauthorized)
    return res.status(401).json({ message: "Пользователь не авторизован" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.get("/logout", (req, res) => {
  try {
    // Удаляем текущую сессию пользователя на сервере
    req.session.destroy();
    // Очищаем cookie с идентификатором сессии на клиенте
    res.clearCookie("user_live");
    // Отправляем клиенту статус 200 (ОК), указывая, что выход выполнен успешно
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Ошибка при удалении" });
  }
});

module.exports = router;
