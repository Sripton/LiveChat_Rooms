require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "database_test",
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl:
        process.env.DB_SSL === "true"
          ? { require: true, rejectUnauthorized: false }
          : false,
    },
  },
};
//   Разбор по частям:
//   dialectOptions
// Это параметр Sequelize, который передаёт специальные опции в драйвер базы данных — в данном случае, PostgreSQL.

//  ssl: ...
// PostgreSQL на многих хостингах требует шифрованное соединение по SSL, чтобы защитить данные.

// process.env.DB_SSL === "true"
// Позволяет включать или отключать SSL через переменную окружения .env.

//   { require: true, rejectUnauthorized: false }
// require: true — включить SSL.

// rejectUnauthorized: false — не проверять подлинность SSL-сертификата (часто требуется на Heroku, Render и т.п., иначе будет ошибка "self signed certificate").

// нужно использовать: Heroku, Railway, Render
