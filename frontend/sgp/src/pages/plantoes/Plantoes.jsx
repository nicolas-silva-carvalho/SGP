"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import PlantaoModal from "../../components/PlantaoModal";
import PlantaoDetailModal from "../../components/PlantaoDetailModal";
import PlantaoEditModal from "../../components/PlantaoEditModal";
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
  Avatar,
  Grid,
  InputAdornment,
  Skeleton,
  createTheme,
  alpha,
  GlobalStyles,
  Alert,
} from "@mui/material";
import {
  Schedule as ClockIcon,
  People as UsersIcon,
  Security as ShieldIcon,
  Add as PlusIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
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
  const {
    plantoes = [],
    error,
    success,
    message,
  } = useSelector((state) => state.plantao);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlantao, setSelectedPlantao] = useState(null);

  useEffect(() => {
    const fetchPlantoes = async () => {
      setIsInitialLoading(true);
      await dispatch(getAllPlantoes());
      setIsInitialLoading(false);
    };
    fetchPlantoes();
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      if (message?.includes("sucesso")) {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDetailModalOpen(false);
        setSelectedPlantao(null);
        dispatch(getAllPlantoes());
      }
      const timer = setTimeout(() => dispatch(reset()), 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      console.error("Erro na operação:", message);
      const timer = setTimeout(() => dispatch(reset()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, message, dispatch]);

  const eventosFormatados = (plantoes || [])
    .filter(
      (plantao) =>
        plantao &&
        ((plantao.observacoes?.toLowerCase() ?? "").includes(
          searchTerm.toLowerCase()
        ) ||
          (plantao.local?.toLowerCase() ?? "").includes(
            searchTerm.toLowerCase()
          ) ||
          plantao.agentes?.some((agent) =>
            (agent?.nome?.toLowerCase() ?? "").includes(
              searchTerm.toLowerCase()
            )
          ) ||
          plantao.motoristas?.some((driver) =>
            (driver?.nome?.toLowerCase() ?? "").includes(
              searchTerm.toLowerCase()
            )
          ))
    )
    .map((plantao) => ({
      id: String(plantao.id),
      title:
        plantao.observacoes ||
        `Plantão em ${plantao.local || "Local não definido"}`,
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

  const handleOpenEditModal = () => {
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPlantao(null);
  };

  const plantoesAtivos = (plantoes || []).filter(
    (p) => p && p.status === "Ativo"
  ).length;
  const plantoesPendentes = (plantoes || []).filter(
    (p) => p && (p.status === "pendente" || p.status === "Pendente")
  ).length;
  const plantoesConcluidos = (plantoes || []).filter(
    (p) => p && p.status === "Concluído"
  ).length;
  const totalAgentes = (plantoes || []).reduce(
    (acc, p) => acc + ((p && p.agentes?.length) || 0),
    0
  );

  return (
    <Layout {...props} title="Calendário de Plantões">
      {calendarGlobalStyles}
      <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
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
                        <Typography variant="h4">{plantoesAtivos}</Typography>
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
                          {plantoesPendentes}
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
                          {plantoesConcluidos}
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
                        <Typography variant="h4">{totalAgentes}</Typography>
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

        {selectedPlantao && (
          <>
            <PlantaoDetailModal
              open={isDetailModalOpen}
              onClose={handleCloseDetailModal}
              plantao={selectedPlantao}
              onEdit={handleOpenEditModal}
            />

            <PlantaoEditModal
              open={isEditModalOpen}
              onClose={handleCloseEditModal}
              initialPlantaoData={selectedPlantao}
            />
          </>
        )}
      </Box>
    </Layout>
  );
}
