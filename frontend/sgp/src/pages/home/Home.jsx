import * as React from "react";
import Typography from "@mui/material/Typography";
import Layout from "../../components/Layout";

export default function Home(props) {
  return (
    <Layout {...props} title="Página principal">
      <Typography
        paragraph
        sx={{ alignSelf: "flex-start", width: "100%", mt: 1 }}
      >
        Este é o conteúdo principal da sua aplicação. Agora ele está posicionado
        corretamente dentro da estrutura padrão, com SideMenu e Navbar.
      </Typography>
    </Layout>
  );
}
