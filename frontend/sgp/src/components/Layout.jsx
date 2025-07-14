import * as React from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import AppNavbar from "./AppNavbar";
import SideMenu from "./SideMenu";
import AppTheme from "../theme/AppTheme";
import Header from "./Header";

import { treeViewCustomizations } from "../theme/customizations/treeView";

const xThemeComponents = {
  ...treeViewCustomizations,
};

export default function Layout({ title, children, ...props }) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                width: "100%", // Garante que ele ocupe a largura toda
                alignSelf: "flex-start", // Alinha à esquerda
                mb: 1, // Adiciona uma margem abaixo
              }}
            >
              {title}
            </Typography>
            <Card variant="outlined" sx={{ width: "100%" }}>
              <CardContent>{children}</CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
