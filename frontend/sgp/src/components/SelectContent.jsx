import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAvatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";

// 1. Mantemos o Avatar estilizado que você criou, pois ele tem a aparência desejada.
const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

export default function StaticDisplay() {
  return (
    // 2. Usamos um Box com 'display: flex' para alinhar o ícone e o texto.
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // Alinha os itens verticalmente ao centro
        gap: 1.5, // Adiciona um espaço entre o ícone e o texto
        p: 1.5, // Adiciona um preenchimento interno, similar ao original
        border: "1px solid", // Borda opcional para o contêiner
        borderColor: "divider",
        borderRadius: 1,
        width: "100%",
        textAlign: "center", // A largura se ajusta ao conteúdo
      }}
    >
      <Avatar>
        {/* Usamos o mesmo ícone e tamanho */}
        <DevicesRoundedIcon sx={{ fontSize: "1rem" }} />
      </Avatar>

      <Typography variant="body1" sx={{ fontWeight: 700, textAlign: "center" }}>
        SGP
      </Typography>
    </Box>
  );
}
