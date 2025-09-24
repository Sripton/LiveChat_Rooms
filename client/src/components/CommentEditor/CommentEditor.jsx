import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { createComments } from "../../redux/actions/commentActions";
export default function CommentEditor({
  postID,
  parentID,
  setOpenReplyPostId,
}) {
  const [inputs, setInputs] = useState("");
  const dispatch = useDispatch();
  const submit = async () => {
    const commentText = inputs.trim();
    if (!commentText) return;
    try {
      await dispatch(
        createComments(postID, { commentTitle: commentText }, parentID)
      );
      setOpenReplyPostId();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box sx={{ display: "flex", gap: 2, mt: 1, alignItems: "center" }}>
      <TextField
        multiline
        minRows={2} // минимум 2 строки
        maxRows={6} // максимум 6 строк (дальше появляется скролл)
        value={inputs}
        onChange={(e) => setInputs(e.target.value)}
        sx={{
          width: {
            xs: "100%", // мобила — во всю ширину
            sm: "320px", // планшет
            md: "420px", // ноут
            lg: "500px", // десктоп
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            background: "rgba(255, 240, 244, 0.6)",
            alignItems: "flex-start", // выравниваем текст сверху, а не по центру
            "& fieldset": {
              borderColor: "rgba(194, 24, 91, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(194, 24, 91, 0.6)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ad1457",
              borderWidth: 2,
            },
          },
          "& .MuiInputBase-input": {
            fontFamily: "'JetBrains Mono', monospace",
            color: "#7a1a50",
            whiteSpace: "pre-wrap", // перенос строк
            wordBreak: "break-word", // перенос длинных слов
          },
        }}
      />
      <Button
        variant="contained"
        onClick={submit}
        sx={{
          px: 2.5,
          borderRadius: 3,
          fontWeight: 700,
          background: "linear-gradient(180deg, #ec407a, #ad1457)", // от розового к бордовому
          boxShadow: "0 4px 12px rgba(173,20,87,0.35)",
          textTransform: "none",
          transition: "all .25s ease",
          "&:hover": {
            background: "linear-gradient(180deg, #f06292, #880e4f)",
            boxShadow: "0 6px 18px rgba(136,14,79,0.4)",
            transform: "translateY(-1px)",
          },
          "&:disabled": {
            background: "rgba(194, 24, 91, 0.2)",
            color: "rgba(194, 24, 91, 0.5)",
          },
        }}
      >
        Отправить
      </Button>
    </Box>
  );
}
