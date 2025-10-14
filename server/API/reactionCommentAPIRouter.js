const express = require("express");
const { Comment, CommentReaction } = require("../db/models");
const router = express.Router();

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { reaction_type } = req.body;
  try {
    const userID = req.session.userID;

    if (!userID) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const existingCommentReactions = await CommentReaction.findOne({
      where: { user_id: userID, comment_id: comment.id },
    });

    if (existingCommentReactions) {
      existingCommentReactions.reaction_type = reaction_type;
      await existingCommentReactions.save();
      return res.status(200).json(existingCommentReactions);
    }

    const createCommentReaction = await CommentReaction.create({
      user_id: userID,
      comment_id: comment.id,
      reaction_type,
    });

    res.status(201).json(createCommentReaction);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const reactions = await CommentReaction.findAll({
      where: { comment_id: id },
    });
    if (!reactions) {
      return res.json([]);
    }
    res.status(200).json(reactions);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
