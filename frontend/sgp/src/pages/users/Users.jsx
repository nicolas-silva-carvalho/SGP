import Typography from "@mui/material/Typography";
import Layout from "../../components/Layout";

export default function Users(props) {
  return (
    <Layout {...props}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ alignSelf: "flex-start", width: "100%", mt: 2 }}
      >
        Controle de usuários
      </Typography>

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
