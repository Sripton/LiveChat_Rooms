import React from "react";

import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import {
  createPostSubmit,
  editPostSubmit,
} from "../../redux/actions/postActions";

import BaseEditor from "../BaseEditor/BaseEditor";
export default function PostEditor({
  setIsPostModalOpen, // открытие формы
  onCancel, // закрытие формы
  roomId, // roomId
  mode, // "create" | "edit"
  postToEdit, // объект поста при редактировании
}) {
  const dispatch = useDispatch();

  return (
    <BaseEditor
      variant="post" // кл-во строк для поста/комментария
      initialValues={mode === "edit" ? (postToEdit?.postTitle ?? "") : ""}
      onSubmit={async (value) => {
        if (mode === "create") {
          dispatch(createPostSubmit(roomId, { postTitle: value }));
        } else {
          dispatch(editPostSubmit(postToEdit.id, { postTitle: value }));
        }
        setIsPostModalOpen(false);
      }}
      onCancel={onCancel}
    />
  );
}
