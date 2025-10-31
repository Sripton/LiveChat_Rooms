import { Box, Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export default function BaseEditor({
  variant, // "post" | "comment"
  initialValues = "",
  onSubmit,
  onCancel,
  closeOnOutsideClick = true, // можно отключить при необходимости
}) {
  const [value, setValue] = useState(initialValues);
  const rootRef = useRef(null);

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

  // закрытие по клику/тачу вне компонента
  useEffect(() => {
    // Эффект работает только если closeOnOutsideClick = true
    if (!closeOnOutsideClick) return;

    const handlePointer = (e) => {
      const element = rootRef.current;
      // если контейнер ещё не смонтирован — ничего не делаем
      if (!element) return;

      // если клик пришёл изнутри — игнорируем
      if (element.contains(e.target)) return;

      // Если клик был взыван вне формы - закрываем
      onCancel?.();
    };

    // mousedown/touchstart — чтобы сработало раньше фокуса на других элементах
    // Третий параметр true означает, что обработчик сработает на фазе перехвата
    window.addEventListener("mousedown", handlePointer, true); // true важно, чтобы клик обработался ДО того, как сработают другие обработчики
    window.addEventListener("touchstart", handlePointer, true); // true важно, чтобы клик обработался ДО того, как сработают другие обработчики

    return () => {
      // Удаляем обработчики при размонтировании компонента, предотвращая утечки памяти.
      window.removeEventListener("mousedown", handlePointer, true);
      window.removeEventListener("touchstart", handlePointer, true);
    };
  }, [onCancel]);

  const hasWord = /\S/.test(value); // есть непустой текст (не только пробелы)

  return (
    <Box
      component="form"
      onSubmit={submit}
      ref={rootRef}
      sx={{
        display: "flex",
        gap: 2,
        mt: 1,
        alignItems: "center",
        position: "relative",
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
