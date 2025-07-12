import React, { useState } from "react";
import {
  Box,
  styled,
  Paper,
  Grid,
  Typography,
  List,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Fade,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // крестик
export default function Modal() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Dialog
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      PaperProps={{
        sx: {
          background: "linear-gradient(135deg, #ffe4ef 0%, #ffe3e3 100%)",
          borderRadius: 5,
          boxShadow:
            "0 12px 48px 0 rgba(230, 30, 99, 0.15), 0 1.5px 4px 0 #fff1f7",
          minWidth: 420,
          p: 0,
        },
      }}
      transitionDuration={400}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: "#d81b60",
          letterSpacing: 1,
          fontSize: 22,
          pb: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fde4ec",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottom: "1.5px solid #fad5e6",
        }}
      >
        Новая комната
        <IconButton
          aria-label="close"
          onClick={() => setModalOpen(false)}
          sx={{
            color: "#ec407a",
            ml: 2,
            "&:hover": {
              background: "#fff0f6",
            },
          }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          px: 4,
          py: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          background: "transparent",
        }}
      >
        <TextField
          autoFocus
          margin="dense"
          label="Название комнаты"
          fullWidth
          variant="outlined"
          sx={{
            background: "#fff",
            borderRadius: 2,
            input: { color: "#ad1457", fontWeight: 500 },
            label: { color: "#d81b60" },
          }}
        />
        <TextField
          margin="dense"
          label="Описание"
          fullWidth
          multiline
          minRows={2}
          variant="outlined"
          sx={{
            background: "#fff",
            borderRadius: 2,
            input: { color: "#ad1457" },
            label: { color: "#d81b60" },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end", pr: 3, pb: 2 }}>
        <Button
          onClick={() => setModalOpen(false)}
          sx={{
            background: "#f8bbd0",
            color: "#d81b60",
            fontWeight: 700,
            borderRadius: 3,
            px: 3,
            boxShadow: "0 2px 12px 0 #ffd6e6",
            "&:hover": {
              background: "#f06292",
              color: "#fff",
            },
          }}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
