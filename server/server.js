const express = require("express"); // Подключаем Express.js
const dotenv = require("dotenv"); // Подключаем dotenv для работы с переменными окружения
const cors = require("cors"); // Подключаем CORS для работы с запросами с других доменовs
const morgan = require("morgan"); // Подключаем morgan для логирования HTTP-запросов
const session = require("express-session"); // Подключаем express-session для управления сессиями
const session_file_store = require("session-file-store"); // Используем FileStore для хранения сессий в файлах
dotenv.config(); // Загружаем переменные окружения из файла .env
const app = express(); // Создаём экземпляр Express-приложения
const PORT = process.env.PORT; // Устанавливаем порт из переменной окружения
const userAPIRouter = require("./API/userAPIRouter");
const roomAPIRouter = require("./API/roomsAPIRouters");
const FileStore = session_file_store(session);
const path = require("path");

app.use(
  cors({
    credentials: true,
    origin: true,
  })
); // Настраиваем CORS, чтобы разрешить кросс-доменные запросы с передачей куков
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

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

app.use("/api/users", userAPIRouter);
app.use("/api/rooms", roomAPIRouter);

app.listen(PORT, () => console.log(`---> Server started on ${PORT} port <---`));
