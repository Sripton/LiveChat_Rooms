import { Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
export default function BaseEditor({
  variant, // "post" | "comment"
  initialValues = "",
  onSubmit,
  onCancel,
}) {
  const [value, setValue] = useState(initialValues);

  // синхронизация при смене initialValue (редактирование другого поста/коммента)
  useEffect(() => {
    setValue(initialValues || "");
  }, [initialValues]);

  const submit = (e) => {
    if (e) e.preventDefault();
    const trimmed = (value || "").trim();
    if (!trimmed) return onCancel?.();
    onSubmit(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      return onCancel?.();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      submit(e);
    }
  };

  const hasAnyChar = value.length > 0; // ввели хоть что-то (включая пробел)
  const hasWord = /\S/.test(value); // есть непустой текст (не только пробелы)
  // const hasOnlySpaces = hasAnyChar && !hasWord; // есть только пробелы

  return (
    <Box
      component="form"
      onSubmit={submit}
      sx={{
        display: "flex",
        gap: 2,
        mt: 1,
        alignItems: "center",
      }}
    >
      <TextField
        // условное задание минимального и максимального количества строк для многострочного текстового поля (TextField с multiline).
        multiline
        minRows={variant === "post" ? 3 : 2}
        maxRows={variant === "post" ? 8 : 6}
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus // Важно. Иначе не срабатывает  onKeyDown={handleKeyDown}
        sx={{
          width: "clamp(280px, 70vw, 720px)",
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            background: "rgba(255, 240, 244, 0.6)",
            "& fieldset": { borderColor: "rgba(194, 24, 91, 0.3)" },
            "&:hover fieldset": { borderColor: "rgba(194, 24, 91, 0.6)" },
            "&.Mui-focused fieldset": {
              borderColor: "#ad1457",
              borderWidth: 2,
            },
          },
          "& .MuiInputBase-input": {
            fontFamily: "'JetBrains Mono', monospace",
            color: "#7a1a50",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          },
        }}
      />

      {!hasAnyChar && (
        <Button
          type="submit"
          sx={{
            px: 2.5,
            borderRadius: 3,
            fontWeight: 700,
            background: "linear-gradient(180deg, #ec407a, #ad1457)",
            boxShadow: "0 4px 12px rgba(173,20,87,0.35)",
            textTransform: "none",
            transition: "all .25s ease",
            color: "#fff",
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
          Отмена
        </Button>
      )}
      {hasWord && (
        <Button
          type="submit"
          sx={{
            px: 2.5,
            borderRadius: 3,
            fontWeight: 700,
            background:
              "linear-gradient(180deg,rgb(165, 241, 161),rgb(143, 178, 145))",
            boxShadow: "0 4px 12px rgba(173,20,87,0.35)",
            textTransform: "none",
            transition: "all .25s ease",
            color: "#fff",
            "&:hover": {
              background:
                "linear-gradient(180deg,rgb(26, 84, 50),rgb(21, 109, 54))",
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
      )}
    </Box>
  );
}

BaseEditor.propTypes = {
  variant: PropTypes.oneOf(["post", "comment"]).isRequired,
  initialValues: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
