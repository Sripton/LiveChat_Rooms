✅ С этой структурой ты можешь:
Получить все приватные комнаты пользователя:

const user = await User.findByPk(userId, {
  include: [{ model: Room, as: "privateRooms" }],
});
Получить всех участников приватной комнаты:

const room = await Room.findByPk(roomId, {
  include: [{ model: User, as: "members" }],
});
Получить все комнаты, созданные пользователем:

const user = await User.findByPk(userId, {
  include: [{ model: Room, as: "ownedRooms" }],
});