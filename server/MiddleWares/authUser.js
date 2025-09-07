// Тестирование на сервере
// Список комнат (публичный)
// fetch("http://localhost:3001/api/rooms", {
//   method: "GET",
//   credentials: "include", // отправит session cookie
// }).then(r => r.json()).then(console.log);

// // Детали конкретной комнаты
// fetch("http://localhost:3001/api/rooms/1", {
//   credentials: "include",
// }).then(r => r.json()).then(console.log);

// // Посты комнаты
// fetch("http://localhost:3001/api/rooms/1/posts", {
//   credentials: "include",
// }).then(r => r.json()).then(console.log);

// // Создать пост (если POST требует логин)
// fetch("http://localhost:3001/api/rooms/1/posts", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ text: "hello" }),
//   credentials: "include",
// }).then(r => r.json()).then(console.log);
