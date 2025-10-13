const express = require("express");
const { Comment, CommentReaction } = require("../db/models");
const router = express.Router();

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { reaction_type } = req.body;
  try {
    const userID = req.session.userID;
    const comment = await Comment.findByPk(id);
    const createCommentReaction = CommentReaction.create({
      user_id: userID,
      comment_id: comment.id,
      reaction_type,
    });

    res.status(201).json(createCommentReaction);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
