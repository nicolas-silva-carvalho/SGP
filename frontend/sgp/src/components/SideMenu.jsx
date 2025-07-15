import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SelectContent from "../components/SelectContent";
import MenuContent from "../components/MenuContent";
import OptionsMenu from "../components/OptionsMenu";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, reset } from "../slices/authSlice";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  const { user } = useAuth();
  // console.log(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
        }}
      >
        <SelectContent />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
          minHeight: 64, // garante altura mínima para manter layout
          overflow: "hidden", // evita scroll
        }}
      >
        <Avatar
          sizes="small"
          alt="Riley Carter"
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box
          sx={{
            mr: "auto",
            overflow: "hidden", // impede que conteúdo estoure
          }}
        >
          <Typography
            variant="body2"
            noWrap
            sx={{
              fontWeight: 500,
              lineHeight: "16px",
              fontSize: "12px",
              maxWidth: 130, // limite horizontal para truncar corretamente
            }}
          >
            {user.name}
          </Typography>
          <Typography
            variant="caption"
            noWrap
            sx={{
              color: "text.secondary",
              maxWidth: 130,
              display: "block",
            }}
          >
            {user.email}
          </Typography>
        </Box>
        <OptionsMenu handleLogout={handleLogout} />
      </Stack>
    </Drawer>
  );
}
