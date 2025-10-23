import React from "react";

import { useDispatch } from "react-redux";
import {
  createComments,
  editCommentSubmit,
} from "../../redux/actions/commentActions";
import BaseEditor from "../BaseEditor/BaseEditor";
export default function CommentEditor({
  postID,
  onClose,
  parentID,
  editComment,
  mode,
}) {
  const dispatch = useDispatch();
  return (
    <BaseEditor
      variant="comment"
      onSubmit={async (value) => {
        if (mode === "edit" && editComment?.id) {
          dispatch(
            editCommentSubmit(postID, editComment?.id, { commentTitle: value })
          );
        } else {
          dispatch(createComments(postID, { commentTitle: value }, parentID));
        }
        onClose?.();
      }}
      onCancel={onClose}
    />
  );
}
