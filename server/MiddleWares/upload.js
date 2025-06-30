// multer — это middleware (промежуточный обработчик) для Express,
// который позволяет обрабатывать файлы, загруженные через формы
// multipart/form-data (например, аватарки, документы и т.д.).
const multer = require("multer");
const path = require("path");

// Настройка хранилища

// Настройка хранилища для загружаемых файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Куда сохранять файл
    cb(null, path.join(__dirname, "../public/usersimg"));
  },
  filename: function (req, file, cb) {
    // Имя файла при сохранении (чтобы было уникально)
    const uniqueName =
      Date.now() +
      "-" +
      file.originalname
        .replace(/\s+/g, "_") // пробелы на _
        .replace(/[^a-zA-Z0-9_.-]/g, ""); // убрать всё кроме латиницы, цифр, точек, тире и подчёркивания
    cb(null, uniqueName);
  },
});
// Создаём middleware, который будет использовать эту настройку
const upload = multer({ storage: storage });
module.exports = upload;
