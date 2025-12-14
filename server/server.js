const express = require("express"); // Подключаем Express.js
const dotenv = require("dotenv"); // Подключаем dotenv для работы с переменными окружения
const cors = require("cors"); // Подключаем CORS для работы с запросами с других доменовs
const morgan = require("morgan"); // Подключаем morgan для логирования HTTP-запросов
const session = require("express-session"); // Подключаем express-session для управления сессиями
const session_file_store = require("session-file-store"); // Используем FileStore для хранения сессий в файлах
dotenv.config(); // Загружаем переменные окружения из файла .env
const app = express(); // Создаём экземпляр Express-приложения
const PORT = process.env.PORT; // Устанавливаем порт из переменной окружения
const userAPIRouter = require("./API/userAPIRouter"); // Импортируем маршруты API для пользователей
const roomAPIRouter = require("./API/roomsAPIRouters"); // Импортируем маршруты API для комнат
const postAPIRouter = require("./API/postAPIRouter"); // Импортируем маршруты API для постов
const roomRequestAPIRouter = require("./API/roomRequestAPIRouter");
const reactionPostAPIRouter = require("./API/reactionPostAPIRouter");
const commentAPIRouter = require("./API/commentAPIRouter");
const reactionCommentAPIRouter = require("./API/reactionCommentAPIRouter");
const FileStore = session_file_store(session); // Используем FileStore для хранения сессий в файлах
const path = require("path");

// Настраиваем CORS, чтобы разрешить кросс-доменные запросы с передачей куков
app.use(
  cors({
    credentials: true,
    origin: true,
  })
); // Настраиваем CORS, чтобы разрешить кросс-доменные запросы с передачей куков
app.use(morgan("dev")); // Включаем логирование HTTP-запросов в режиме "dev"
app.use(express.json()); // Подключаем встроенный middleware для обработки JSON-запросов
app.use(express.urlencoded({ extended: true })); // Подключаем middleware для обработки данных формы
app.use(express.static(path.join(__dirname, "public"))); // Делаем папку "public" доступной для статики (картинки, CSS, JS)

const sessionConfig = {
  name: "user_live", // Название cookie сессии
  secret: process.env.SESSION_SECRET ?? "test", // Секретный ключ для подписи сессий (из .env или дефолтное "test")
  //resave: false - Этот параметр управляет поведением express-session при первой инициализации сессии — т.е. когда в req.session ещё ничего нет.
  // saveUninitialized: true
  //     — сохраняет даже пустую сессию в хранилище при первом запросе.
  // saveUninitialized: false
  //     — НЕ сохраняет сессию, пока ты не положишь туда данные вручную (например, req.session.userID = ...).
  // saveUninitialized: false — это нормально и правильно, особенно если ты работаешь с логином, профилем, пользовательскими данными.
  resave: false, // Принудительное сохранение сессии в хранилище при каждом запросе
  store: new FileStore(), // Хранилище сессий в файлах
  saveUninitialized: false, // Не сохраняем сессию, если она пустая
  cookie: {
    maxAge: 1000 * 60 * 60 * 12, // Время жизни куки (12 часов)
    httpOnly: true, // Делаем куку недоступной для JavaScript (только сервер)
    sameSite: "lax", // Политика sameSite (предотвращает CSRF-атаки)
    secure: false, // Должно быть true в продакшене (только HTTPS)
  },
};
app.use(session(sessionConfig));

app.use("/api/users", userAPIRouter); // Маршрут для пользователя
app.use("/api/rooms", roomAPIRouter); // Маршрут для комнат
app.use("/api/room-requests", roomRequestAPIRouter); // Маршрут для запросов
app.use("/api/posts", postAPIRouter); // Маршрут для постов
app.use("/api/reaction-post", reactionPostAPIRouter); // Маршрут для реакций на посты
app.use("/api/comments", commentAPIRouter);
app.use("/api/reaction-comment", reactionCommentAPIRouter);
app.listen(PORT, () => console.log(`---> Server started on ${PORT} port <---`));
