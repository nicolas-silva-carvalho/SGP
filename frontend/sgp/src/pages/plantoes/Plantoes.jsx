"use client";

// --- FIX: Correção de compatibilidade para FullCalendar/Preact ---
import * as preactCore from "preact";
import * as preactCompat from "preact/compat";
// Object.assign(preactCore, preactCompat);
// ----------------------------------------------------------------

import * as React from "react";
import Layout from "../../components/Layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

// Importações do MUI
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  Avatar,
  Chip,
  Grid,
  Paper,
  IconButton,
  InputAdornment,
  Divider,
  Skeleton,
  createTheme, // O createTheme ainda é necessário para usar o objeto 'theme' localmente
  alpha,
  GlobalStyles,
} from "@mui/material";

// Ícones do MUI
import {
  Schedule as ClockIcon,
  People as UsersIcon,
  DirectionsCar as CarIcon,
  Security as ShieldIcon,
  LocationOn as MapPinIcon,
  Add as PlusIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";

// Tema Customizado (ainda precisamos do objeto para estilizações dinâmicas)
const theme = createTheme({
  palette: {
    primary: { main: "#3b82f6", dark: "#2563eb" },
    secondary: { main: "#6366f1", dark: "#4f46e5" },
    success: { main: "#10b981", light: "#34d399" },
    warning: { main: "#f59e0b", light: "#fbbf24" },
    error: { main: "#ef4444", light: "#f87171" },
    background: { default: "#f8fafc", paper: "#ffffff" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
  },
});

const calendarGlobalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      // <--- 2. CRIE UMA CONSTANTE COM OS ESTILOS
      ".fc-toolbar-title": {
        fontSize: "1.5rem !important",
        fontWeight: "700 !important",
        color: "#1f2937 !important",
      },
      ".fc .fc-button": {
        backgroundColor: `${theme.palette.primary.main} !important`,
        border: "none !important",
        boxShadow: "none !important",
      },
      ".fc .fc-button:hover": {
        backgroundColor: `${theme.palette.primary.dark} !important`,
      },
      ".fc .fc-daygrid-day.fc-day-today": {
        backgroundColor: `${alpha(theme.palette.primary.main, 0.1)} !important`,
      },
      ".fc-event": {
        padding: "4px 6px !important",
        fontWeight: "500 !important",
        cursor: "pointer !important",
      },
    })}
  />
);

export default function Plantoes(props) {
  const [plantoes, setPlantoes] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedPlantao, setSelectedPlantao] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    setTimeout(() => {
      const dadosMocados = [
        // ... seus dados mocados continuam aqui ...
        {
          id: 1,
          data_inicio: "2025-07-15T08:00:00",
          data_fim: "2025-07-15T20:00:00",
          observacoes: "Plantão Diurno - Equipe A",
          agentes: [
            {
              nome: "Sgt. Rocha",
              cargo: "Comandante",
              avatar: "https://i.pravatar.cc/40?u=1",
            },
            {
              nome: "Cabo Silva",
              cargo: "Patrulheiro",
              avatar: "https://i.pravatar.cc/40?u=2",
            },
          ],
          motoristas: [
            { nome: "Cabo Borges", avatar: "https://i.pravatar.cc/40?u=3" },
          ],
          status: "ativo",
          prioridade: "alta",
          local: "Centro da Cidade",
        },
        {
          id: 2,
          data_inicio: "2025-07-16T20:00:00",
          data_fim: "2025-07-17T08:00:00",
          observacoes: "Plantão Noturno - Viatura 1234",
          agentes: [
            {
              nome: "Sd. Lima",
              cargo: "Patrulheiro",
              avatar: "https://i.pravatar.cc/40?u=4",
            },
          ],
          motoristas: [
            { nome: "Sd. Costa", avatar: "https://i.pravatar.cc/40?u=5" },
          ],
          status: "pendente",
          prioridade: "media",
          local: "Zona Norte",
        },
        {
          id: 3,
          data_inicio: "2025-07-18T08:00:00",
          data_fim: "2025-07-18T20:00:00",
          observacoes: "Apoio em evento especial",
          agentes: [
            {
              nome: "Insp. Ana",
              cargo: "Inspetora",
              avatar: "https://i.pravatar.cc/40?u=6",
            },
            {
              nome: "Sgt. Pedro",
              cargo: "Sargento",
              avatar: "https://i.pravatar.cc/40?u=7",
            },
          ],
          status: "concluido",
          prioridade: "alta",
          local: "Estádio Municipal",
        },
      ];
      setPlantoes(dadosMocados);
      setLoading(false);
    }, 1500);
  }, []);

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case "alta":
        return "error";
      case "media":
        return "warning";
      case "baixa":
        return "success";
      default:
        return "default";
    }
  };

  const eventosFormatados = plantoes
    .filter(
      (plantao) =>
        plantao.observacoes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plantao.local?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((plantao) => ({
      id: String(plantao.id),
      title: plantao.observacoes || "Plantão",
      start: plantao.data_inicio,
      end: plantao.data_fim,
      backgroundColor:
        plantao.status === "ativo"
          ? theme.palette.success.main
          : plantao.status === "pendente"
          ? theme.palette.warning.main
          : theme.palette.primary.main,
      borderColor: "transparent",
      extendedProps: { ...plantao },
    }));

  const handleEventClick = (clickInfo) => {
    setSelectedPlantao(clickInfo.event.extendedProps);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlantao(null);
  };

  return (
    <Layout {...props} title="Calendário de Plantões">
      {calendarGlobalStyles}
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          // Acessa o tema do contexto para o fundo, ou usa o fallback do nosso 'theme' local
        }}
      >
        {loading ? (
          // Skeleton Loading
          <Box>
            <Skeleton variant="text" width="25%" height={40} sx={{ mb: 3 }} />
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[...Array(4)].map((_, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Skeleton
                    variant="rectangular"
                    height={118}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              ))}
            </Grid>
            <Skeleton
              variant="rectangular"
              height="70vh"
              sx={{ borderRadius: 3 }}
            />
          </Box>
        ) : (
          // Conteúdo Principal
          <>
            {/* Header da Página */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography variant="h4" color="text.primary">
                Visão Geral
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  size="small"
                  placeholder="Buscar plantões..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 },
                  }}
                />
                <Button variant="outlined" startIcon={<FilterIcon />}>
                  Filtros
                </Button>
                <Button variant="contained" startIcon={<PlusIcon />}>
                  Novo Plantão
                </Button>
              </Box>
            </Box>

            {/* Cards de Estatísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Card Ativos */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: alpha("#ffffff", 0.8), mb: 1 }}
                        >
                          Plantões Ativos
                        </Typography>
                        <Typography variant="h4">
                          {plantoes.filter((p) => p.status === "ativo").length}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: alpha("#ffffff", 0.2) }}>
                        <ShieldIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {/* ... Outros cards ... */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: alpha("#ffffff", 0.8), mb: 1 }}
                        >
                          Pendentes
                        </Typography>
                        <Typography variant="h4">
                          {
                            plantoes.filter((p) => p.status === "pendente")
                              .length
                          }
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: alpha("#ffffff", 0.2) }}>
                        <ClockIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: alpha("#ffffff", 0.8), mb: 1 }}
                        >
                          Concluídos
                        </Typography>
                        <Typography variant="h4">
                          {
                            plantoes.filter((p) => p.status === "concluido")
                              .length
                          }
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: alpha("#ffffff", 0.2) }}>
                        <BadgeIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: alpha("#ffffff", 0.8), mb: 1 }}
                        >
                          Total Agentes
                        </Typography>
                        <Typography variant="h4">
                          {plantoes.reduce(
                            (acc, p) => acc + (p.agentes?.length || 0),
                            0
                          )}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: alpha("#ffffff", 0.2) }}>
                        <UsersIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Calendário */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <style>{`
                  .fc-toolbar-title {
                    font-size: 1.5rem !important;
                    font-weight: 700 !important;
                    color: #1f2937 !important;
                  }
                  .fc .fc-button {
                    background-color: ${theme.palette.primary.main} !important;
                    border: none !important;
                    box-shadow: none !important;
                  }
                  .fc .fc-button:hover {
                    background-color: ${theme.palette.primary.dark} !important;
                  }
                  .fc .fc-daygrid-day.fc-day-today {
                    background-color: ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )} !important;
                  }
                  .fc-event {
                    padding: 4px 6px !important;
                    font-weight: 500 !important;
                    cursor: pointer !important;
                  }
                `}</style>
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  events={eventosFormatados}
                  eventClick={handleEventClick}
                  editable={true}
                  selectable={true}
                  locale={ptBrLocale}
                  height="75vh"
                  dayMaxEvents={3}
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* Modal de Detalhes */}
        <Dialog
          open={modalOpen}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          {selectedPlantao && (
            <>
              <DialogTitle
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <ShieldIcon />
                  </Avatar>
                  <Typography variant="h5" component="h2">
                    {selectedPlantao.observacoes}
                  </Typography>
                </Box>
                <IconButton onClick={handleCloseModal}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                {/* ... conteúdo do modal ... */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      {" "}
                      Início{" "}
                    </Typography>
                    <Typography>
                      {new Date(selectedPlantao.data_inicio).toLocaleString(
                        "pt-BR"
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      {" "}
                      Fim{" "}
                    </Typography>
                    <Typography>
                      {new Date(selectedPlantao.data_fim).toLocaleString(
                        "pt-BR"
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      {" "}
                      Local{" "}
                    </Typography>
                    <Typography>{selectedPlantao.local}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      {" "}
                      Prioridade{" "}
                    </Typography>
                    <Chip
                      label={selectedPlantao.prioridade}
                      color={getPriorityColor(selectedPlantao.prioridade)}
                      size="small"
                    />
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                {selectedPlantao.agentes && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {" "}
                      Agentes{" "}
                    </Typography>
                    {selectedPlantao.agentes.map((agente, index) => (
                      <Paper
                        key={index}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Avatar src={agente.avatar} />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {agente.nome}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {agente.cargo}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
                {selectedPlantao.motoristas && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {" "}
                      Motoristas{" "}
                    </Typography>
                    {selectedPlantao.motoristas.map((motorista, index) => (
                      <Paper
                        key={index}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Avatar src={motorista.avatar} />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {motorista.nome}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                )}
              </DialogContent>
            </>
          )}
        </Dialog>
      </Box>
    </Layout>
  );
}
