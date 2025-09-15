const express = require("express");
const { Post, Postreaction } = require("../db/models");
const router = express.Router();

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { reaction_type } = req.body;
  try {
    const userID = req.session.userID;
    const post = await Post.findByPk(id);
    if (!post) {
      res.status(404).json({ message: "Пост не найден" });
    }
    // Проверка, оставлял ли пользователь уже реакцию на этот пост
    const existingPostReaction = await Postreaction.findOne({
      where: {
        user_id: userID,
        post_id: post.id,
      },
    });

    if (existingPostReaction) {
      // Если реакция уже существует, обновляем её
      existingPostReaction.reaction_type = reaction_type;
      await existingPostReaction.save();
      return res.status(200).json(existingPostReaction);
    }
    // Если реакции нет, создаем новую
    const createPostReaction = await Postreaction.create({
      user_id: userID,
      post_id: post.id,
      reaction_type,
    });
    res.status(200).json(createPostReaction);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const reactions = await Postreaction.findAll({
      where: { post_id: id },
    });
    if (!reactions.length) {
      return res.json([]);
    }
    res.status(200).json(reactions);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
