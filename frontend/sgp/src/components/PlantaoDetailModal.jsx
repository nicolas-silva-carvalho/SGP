"use client";

import {
  Modal,
  Box,
  Typography,
  IconButton,
  Fade,
  Backdrop,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  DriveEta as DriveEtaIcon,
  LocalGasStation as LocalGasStationIcon,
  CalendarToday as CalendarTodayIcon,
  LocationOn as LocationOnIcon,
  Flag as FlagIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";

// Helper function to get priority color
const getPriorityColor = (priority) => {
  switch (priority) {
    case "Baixa":
      return "success";
    case "Média":
      return "warning";
    case "Alta":
      return "error";
    case "Crítica":
      return "error"; // Or a custom color if needed
    default:
      return "default";
  }
};

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case "Ativo":
      return "primary";
    case "Concluído":
      return "success";
    case "Cancelado":
      return "error";
    case "Em Andamento":
      return "info";
    default:
      return "default";
  }
};

const PlantaoDetailModal = ({ open, onClose, plantao, onEdit }) => {
  if (!plantao) return null;

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: "90%", md: "900px", lg: "1100px" },
    maxHeight: "95vh",
    overflow: "hidden",
    bgcolor: "transparent",
    outline: "none",
  };

  const contentStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 32px 64px rgba(0, 0, 0, 0.15)",
    overflow: "hidden",
    position: "relative",
  };

  const headerStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #3aa5cfff 100%)",
    color: "white",
    p: 3,
    borderRadius: "20px 20px 0 0",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      opacity: 0.3,
    },
  };

  const sectionCardStyle = {
    mb: 3,
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      background: "rgba(255, 255, 255, 0.9)",
    },
  };

  const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    mb: 3,
    pb: 2,
    borderBottom: "1px solid rgba(0,0,0,0.08)",
  };

  const sectionTitleStyle = {
    fontWeight: 700,
    color: "#1f2937",
    fontSize: "1.3rem",
    ml: 2,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: {
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <Fade in={open} timeout={600}>
        <Box sx={modalStyle}>
          <Box sx={contentStyle}>
            {/* Header */}
            <Box sx={headerStyle}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <AssignmentIcon sx={{ fontSize: 32 }} />
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{ fontWeight: "bold" }}
                  >
                    Detalhes do Plantão
                  </Typography>
                </Box>
                <IconButton
                  onClick={onClose}
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      transform: "rotate(90deg)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            <Box
              sx={{
                p: 4,
                maxHeight: "calc(90vh - 120px)",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                  height: "0.4em",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.0)",
                  borderRadius: "10px",
                },
                scrollbarWidth: "none",
                "-ms-overflow-style": "none",
              }}
            >
              {/* Informações Gerais */}
              <Box sx={sectionCardStyle}>
                <Box sx={{ p: 4 }}>
                  <Box sx={sectionHeaderStyle}>
                    <Avatar
                      sx={{
                        bgcolor: "#6366f1",
                        boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                      }}
                    >
                      <InfoIcon />
                    </Avatar>
                    <Typography variant="h6" sx={sectionTitleStyle}>
                      Informações Gerais
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <CalendarTodayIcon fontSize="small" /> Início
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {plantao.data_inicio
                          ? new Date(plantao.data_inicio).toLocaleString(
                              "pt-BR"
                            )
                          : "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <CalendarTodayIcon fontSize="small" /> Fim
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {plantao.data_fim
                          ? new Date(plantao.data_fim).toLocaleString("pt-BR")
                          : "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <LocationOnIcon fontSize="small" /> Local
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {plantao.local || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <AssignmentIcon fontSize="small" /> Status
                      </Typography>
                      <Chip
                        label={plantao.status || "N/A"}
                        color={getStatusColor(plantao.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <FlagIcon fontSize="small" /> Prioridade
                      </Typography>
                      <Chip
                        label={plantao.prioridade || "N/A"}
                        color={getPriorityColor(plantao.prioridade)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              {/* Observações */}
              {plantao.observacoes && (
                <Box sx={sectionCardStyle}>
                  <Box sx={{ p: 4 }}>
                    <Box sx={sectionHeaderStyle}>
                      <Avatar
                        sx={{
                          bgcolor: "#6b7280",
                          boxShadow: "0 4px 12px rgba(107, 114, 128, 0.3)",
                        }}
                      >
                        <DescriptionIcon />
                      </Avatar>
                      <Typography variant="h6" sx={sectionTitleStyle}>
                        Observações
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {plantao.observacoes}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Agentes Responsáveis */}
              {plantao.agentes && plantao.agentes.length > 0 && (
                <Box sx={sectionCardStyle}>
                  <Box sx={{ p: 4 }}>
                    <Box sx={sectionHeaderStyle}>
                      <Avatar
                        sx={{
                          bgcolor: "#10b981",
                          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                        }}
                      >
                        <SecurityIcon />
                      </Avatar>
                      <Typography variant="h6" sx={sectionTitleStyle}>
                        Agentes Responsáveis
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {plantao.agentes.map((agente, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2,
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              borderRadius: "12px",
                              backgroundColor: "rgba(16, 185, 129, 0.05)",
                              border: "1px solid rgba(16, 185, 129, 0.1)",
                            }}
                          >
                            <Avatar sx={{ bgcolor: "#059669" }}>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 600 }}
                              >
                                {agente.nome}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {agente.cargo}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              )}

              {/* Motoristas */}
              {plantao.motoristas && plantao.motoristas.length > 0 && (
                <Box sx={sectionCardStyle}>
                  <Box sx={{ p: 4 }}>
                    <Box sx={sectionHeaderStyle}>
                      <Avatar
                        sx={{
                          bgcolor: "#f59e0b",
                          boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                      <Typography variant="h6" sx={sectionTitleStyle}>
                        Motoristas
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {plantao.motoristas.map((motorista, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2,
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              borderRadius: "12px",
                              backgroundColor: "rgba(245, 158, 11, 0.05)",
                              border: "1px solid rgba(245, 158, 11, 0.1)",
                            }}
                          >
                            <Avatar sx={{ bgcolor: "#d97706" }}>
                              <PersonIcon />
                            </Avatar>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              {motorista.nome}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              )}

              {/* Movimentações da Viatura */}
              {plantao.movimentacoes && plantao.movimentacoes.length > 0 && (
                <Box sx={sectionCardStyle}>
                  <Box sx={{ p: 4 }}>
                    <Box sx={sectionHeaderStyle}>
                      <Avatar
                        sx={{
                          bgcolor: "#3b82f6",
                          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                        }}
                      >
                        <DriveEtaIcon />
                      </Avatar>
                      <Typography variant="h6" sx={sectionTitleStyle}>
                        Movimentações da Viatura
                      </Typography>
                    </Box>
                    <TableContainer
                      component={Paper}
                      sx={{
                        borderRadius: "12px",
                        boxShadow: "none",
                        border: "1px solid rgba(0,0,0,0.08)",
                      }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow
                            sx={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                          >
                            <TableCell sx={{ fontWeight: 700 }}>
                              Placa
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                              KM Inicial
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                              KM Final
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                              Percorrido
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                              Total Abastecido
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {plantao.movimentacoes.map((mov, index) => {
                            const percorrido =
                              mov.kmFinal && mov.kmInicial
                                ? mov.kmFinal - mov.kmInicial
                                : 0;
                            const totalAbastecido = mov.abastecimentos
                              ? mov.abastecimentos.reduce(
                                  (sum, abs) => sum + abs.valor,
                                  0
                                )
                              : 0;
                            return (
                              <TableRow key={index}>
                                <TableCell>{mov.placa}</TableCell>
                                <TableCell>{mov.kminicial} km</TableCell>
                                <TableCell>{mov.kmfinal} km</TableCell>
                                <TableCell>{percorrido} km</TableCell>
                                <TableCell>
                                  R$ {totalAbastecido.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              )}

              {/* Detalhes dos Abastecimentos */}
              {plantao.movimentacoes.some(
                (mov) => mov.abastecimentos && mov.abastecimentos.length > 0
              ) && (
                <Box sx={sectionCardStyle}>
                  <Box sx={{ p: 4 }}>
                    <Box sx={sectionHeaderStyle}>
                      <Avatar
                        sx={{
                          bgcolor: "#ef4444",
                          boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                        }}
                      >
                        <LocalGasStationIcon />
                      </Avatar>
                      <Typography variant="h6" sx={sectionTitleStyle}>
                        Detalhes dos Abastecimentos
                      </Typography>
                    </Box>
                    <TableContainer
                      component={Paper}
                      sx={{
                        borderRadius: "12px",
                        boxShadow: "none",
                        border: "1px solid rgba(0,0,0,0.08)",
                      }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow
                            sx={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                          >
                            <TableCell sx={{ fontWeight: 700 }}>
                              Placa da Viatura
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                              KM Abastecido
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                              Valor Pago
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {plantao.movimentacoes.map((mov) =>
                            mov.abastecimentos && mov.abastecimentos.length > 0
                              ? mov.abastecimentos.map((abast, abastIndex) => (
                                  <TableRow key={`${mov.placa}-${abastIndex}`}>
                                    <TableCell>{mov.placa}</TableCell>
                                    <TableCell>
                                      {abast.kilometroabastecimento} km
                                    </TableCell>
                                    <TableCell>
                                      R$ {abast.valor.toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ))
                              : null
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              )}

              {/* Botão de Fechar */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                  pt: 2,
                  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={onClose}
                  sx={{
                    borderRadius: "12px",
                    px: 3,
                    py: 1.5,
                    borderColor: "rgba(0, 0, 0, 0.12)",
                    color: "#6b7280",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "rgba(0, 0, 0, 0.2)",
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Fechar
                </Button>
                <Button
                  variant="contained"
                  onClick={onEdit}
                  // Adicione a propriedade startIcon aqui
                  startIcon={<EditIcon />}
                  sx={{
                    borderRadius: "12px",
                    px: 4,
                    py: 1.5,
                    marginLeft: 2,
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #48d3ecff 100%)",
                    boxShadow: "0 8px 32px rgba(99, 102, 241, 0.4)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5855eb 0%, #7c3aed 50%, #27abc2ff 100%)",
                      boxShadow: "0 12px 40px rgba(99, 102, 241, 0.6)",
                      transform: "translateY(-3px)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Editar Plantão
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PlantaoDetailModal;
