import React from "react";

import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import {
  createPostSubmit,
  editPostSubmit,
} from "../../redux/actions/postActions";

import BaseEditor from "../BaseEditor/BaseEditor";
export default function ModalPostCreate({
  openModalPost,
  setOpenModalPost,
  closeModalPost,
  roomID, // roomId
  mode, // "create" | "edit"
  editPost, // объект поста при редактировании
}) {
  const dispatch = useDispatch();

  return (
    <BaseEditor
      variant="post"
      initialValues={mode === "edit" ? editPost?.postTitle ?? "" : ""}
      onSubmit={async (value) => {
        if (mode === "create") {
          dispatch(createPostSubmit(roomID, { postTitle: value }));
        } else {
          dispatch(editPostSubmit(editPost.id, { postTitle: value }));
        }
        setOpenModalPost(false);
      }}
      onCancel={closeModalPost}
    />
  );
}
