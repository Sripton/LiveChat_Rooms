import { Avatar, Divider, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";

export default function CommentsCard({ comments }) {
  const accent = "#7a1a50"; // бордовый
  const accentSoft = "rgba(161,19,74,0.08)";
  const cardBg = "rgba(255, 238, 244, 0.85)"; // светло-розово-бордовый фон

  const formatDate = (dt) => {
    if (!dt) return "";
    try {
      const d = typeof dt === "string" ? new Date(dt) : dt;
      return d.toLocaleString();
    } catch {
      return "";
    }
  };
  console.log("comments", comments);
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: cardBg,
        border: `1px solid ${accentSoft}`,
        boxShadow:
          "0 10px 30px rgba(161,19,74,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      <Box sx={{ mb: 1.5, display: "flex", alignItems: "baseline", gap: 1 }}>
        <Typography
          variant="h6"
          sx={{
            color: accent,
            fontWeight: 800,
            letterSpacing: 0.2,
            fontFamily:
              "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          Комментарии
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(122,26,80,0.65)" }}>
          {comments.length}
        </Typography>
      </Box>

      {comments.length === 0 ? (
        <Typography
          variant="body2"
          sx={{ color: "rgba(122,26,80,0.6)", fontStyle: "italic" }}
        >
          Пока нет комментариев.
        </Typography>
      ) : (
        <Stack
          divider={<Divider sx={{ borderColor: accentSoft }} />}
          spacing={1.5}
        >
          {comments.map((comment) => {
            const name = comment?.User?.name;
            const avatarUrl = comment?.User?.avatar;
            const text = comment?.commentTitle || "";
            const when = formatDate(comment?.createdAt);

            return (
              <Box
                key={comment.id ?? `${name}-${when}-${text.slice(0, 10)}`}
                sx={{ display: "flex", gap: 1.25 }}
              >
                {!avatarUrl ? (
                  <Avatar />
                ) : (
                  <Avatar
                    src={`${process.env.REACT_APP_BASEURL}${avatarUrl}`}
                    alt={name}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: avatarUrl ? undefined : "rgba(161,19,74,0.15)",
                      color: accent,
                      border: `1px solid ${accentSoft}`,
                      fontWeight: 700,
                    }}
                  />
                )}

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: accent,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        maxWidth: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={name}
                    >
                      {name}
                    </Typography>
                    {when && (
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(122,26,80,0.65)" }}
                      >
                        {when}
                      </Typography>
                    )}
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.25,
                      color: "#5c1842",
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {text}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}
