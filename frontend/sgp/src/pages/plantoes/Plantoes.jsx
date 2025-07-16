"use client";

// --- FIX: Correção de compatibilidade para FullCalendar/Preact ---
import * as preactCore from "preact";
import * as preactCompat from "preact/compat";
// Object.assign(preactCore, preactCompat); // This line is commented out, ensure it's not strictly needed or handle Preact setup elsewhere if issues arise
// ----------------------------------------------------------------

import * as React from "react";
import { useEffect } from "react"; // Explicitly import useEffect
import Layout from "../../components/Layout";
import PlantaoModal from "../../components/PlantaoModal";
import PlantaoDetailModal from "../../components/PlantaoDetailModal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

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
  createTheme,
  alpha,
  GlobalStyles,
  Alert,
} from "@mui/material";

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

import { useSelector, useDispatch } from "react-redux";
import { getAllPlantoes, reset } from "../../slices/plantaoSlice";

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
  const dispatch = useDispatch();
  const { plantoes, error, success, message } = useSelector(
    (state) => state.plantao
  );
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [selectedPlantao, setSelectedPlantao] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  useEffect(() => {
    const fetchPlantoes = async () => {
      setIsInitialLoading(true);
      await dispatch(getAllPlantoes());
      setIsInitialLoading(false);
    };
    fetchPlantoes();
  }, [dispatch]);

  useEffect(() => {
    if (success && message) {
      if (message.includes("Plantão criado com sucesso!")) {
        console.log("Plantão criado com sucesso:", message);
        setIsCreateModalOpen(false);
        dispatch(getAllPlantoes());
      }
      dispatch(reset());
    }
    if (error && message) {
      console.error("Erro na operação:", message);
      dispatch(reset());
    }
  }, [success, error, message, dispatch]);

  const getPriorityColor = (prioridade) => {
    switch (prioridade?.toLowerCase()) {
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

  // Format events for FullCalendar
  const eventosFormatados = plantoes
    .filter(
      (plantao) =>
        plantao && // Ensure plantao is not null or undefined
        (plantao.observacoes
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          plantao.local?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plantao.agentes?.some((agent) =>
            agent.nome.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          plantao.motoristas?.some((driver) =>
            driver.nome.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    )
    .map((plantao) => ({
      id: String(plantao.id),
      title: plantao.observacoes || "Plantão",
      start: plantao.data_inicio,
      end: plantao.data_fim,
      backgroundColor:
        plantao.status?.toLowerCase() === "ativo"
          ? theme.palette.success.main
          : plantao.status?.toLowerCase() === "pendente"
          ? theme.palette.warning.main
          : plantao.status?.toLowerCase() === "concluido"
          ? theme.palette.primary.main
          : theme.palette.grey[500],
      borderColor: "transparent",
      extendedProps: { ...plantao },
    }));

  const handleEventClick = (clickInfo) => {
    setSelectedPlantao(clickInfo.event.extendedProps);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPlantao(null);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <Layout {...props} title="Calendário de Plantões">
      {calendarGlobalStyles}
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
        }}
      >
        {success && message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        {error && message && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {isInitialLoading ? (
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
          <>
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
                <Button
                  variant="contained"
                  startIcon={<PlusIcon />}
                  onClick={handleOpenCreateModal}
                >
                  Novo Plantão
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
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
                          {plantoes.filter((p) => p.status === "Ativo").length}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: alpha("#ffffff", 0.2) }}>
                        <ShieldIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
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

            <Card>
              <CardContent sx={{ p: 3 }}>
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

        <PlantaoModal
          open={isCreateModalOpen}
          onClose={handleCloseCreateModal}
        />

        <PlantaoDetailModal
          open={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          plantao={selectedPlantao}
        />
      </Box>
    </Layout>
  );
}
