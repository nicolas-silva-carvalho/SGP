import * as React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { Link as RouterLink, useLocation } from "react-router-dom";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

const routeNameMap = {
  home: "Home",
  analytics: "Analytics",
  clients: "Clients",
  tasks: "Tasks",
  settings: "Settings",
  about: "About",
  feedback: "Feedback",
};

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {/* 5. LINK FIXO PARA A PÁGINA INICIAL/DASHBOARD */}
      <RouterLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Typography variant="body1">Home</Typography>
      </RouterLink>

      {/* 6. RENDERIZE CADA SEGMENTO DA URL DINAMICAMENTE */}
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        // Pega o nome do mapa ou usa o próprio valor da URL (ex: para IDs)
        const name = routeNameMap[value] || value;

        return last ? (
          // O último item é a página atual, não é um link
          <Typography
            variant="body1"
            sx={{ color: "text.primary", fontWeight: 600 }}
            key={to}
          >
            {name}
          </Typography>
        ) : (
          // Itens intermediários são links
          <RouterLink
            to={to}
            key={to}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography variant="body1">{name}</Typography>
          </RouterLink>
        );
      })}
    </StyledBreadcrumbs>
  );
}
