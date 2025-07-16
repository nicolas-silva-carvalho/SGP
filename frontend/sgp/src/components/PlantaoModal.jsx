"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
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
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  LocalGasStation as GasIcon,
  Badge as BadgeIcon,
  Speed as SpeedIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  AccessTime as TimeIcon,
  Security as SecurityIcon,
  DriveEta as DriveIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Work as WorkAgente,
  CheckCircle as CheckCircleIcon,
  Flag as FlagIcon, // Para prioridade
  LocationOn as LocationIcon, // Para local
  Assignment as StatusIcon, // Para status
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";

import { useSelector, useDispatch } from "react-redux";
// Import the createPlantao thunk and reset action from your slice
import { createPlantao, reset } from "../slices/plantaoSlice";

const PlantaoModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector(
    (state) => state.plantao // Assuming your slice is named 'plantao' in your Redux store
  );

  const [formData, setFormData] = useState({
    dataInicial: null,
    dataFinal: null,
    observacoes: "",
    status: "Ativo",
    prioridade: "Média",
    local: "",
  });

  // Estados para cada seção
  const [agentes, setAgentes] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);

  // Estados para formulários temporários
  const [tempAgente, setTempAgente] = useState({ nome: "", carga: "" });
  const [tempMotorista, setTempMotorista] = useState({ nome: "" });
  const [tempMovimentacao, setTempMovimentacao] = useState({
    placa: "",
    kmInicial: "",
    kmFinal: "",
  });
  const [tempAbastecimento, setTempAbastecimento] = useState({
    kmAbastecido: "",
    valorPago: "",
  });

  // Estados para edição
  const [editingAgente, setEditingAgente] = useState(null);
  const [editingMotorista, setEditingMotorista] = useState(null);
  const [editingMovimentacao, setEditingMovimentacao] = useState(null);
  const [editingAbastecimento, setEditingAbastecimento] = useState(null);

  // Estado para controlar qual movimentação está sendo abastecida
  const [selectedMovimentacao, setSelectedMovimentacao] = useState(null);

  // Effect to handle success/error messages and close modal
  useEffect(() => {
    if (success && message) {
      // Optionally show a success toast/snackbar here
      console.log("Success:", message);
      // Reset form and close modal after successful submission
      setFormData({
        dataInicial: null,
        dataFinal: null,
        observacoes: "",
        status: "Ativo",
        prioridade: "Média",
        local: "",
      });
      setAgentes([]);
      setMotoristas([]);
      setMovimentacoes([]);
      setTempAgente({ nome: "", carga: "" });
      setTempMotorista({ nome: "" });
      setTempMovimentacao({ placa: "", kmInicial: "", kmFinal: "" });
      setTempAbastecimento({ kmAbastecido: "", valorPago: "" });
      setEditingAgente(null);
      setEditingMotorista(null);
      setEditingMovimentacao(null);
      setEditingAbastecimento(null);
      setSelectedMovimentacao(null);
      onClose(); // Close the modal
      dispatch(reset()); // Reset Redux state
    }
    if (error && message) {
      // Optionally show an error toast/snackbar here
      console.error("Error:", message);
      dispatch(reset()); // Reset Redux state
    }
  }, [success, error, message, dispatch, onClose]);

  const handleDateChange = (field) => (date) => {
    setFormData({
      ...formData,
      [field]: date,
    });
  };

  const handleInputChange = (section, field) => (event) => {
    if (section === "main") {
      setFormData({ ...formData, [field]: event.target.value });
    } else if (section === "agente") {
      setTempAgente({ ...tempAgente, [field]: event.target.value });
    } else if (section === "motorista") {
      setTempMotorista({ ...tempMotorista, [field]: event.target.value });
    } else if (section === "movimentacao") {
      setTempMovimentacao({ ...tempMovimentacao, [field]: event.target.value });
    } else if (section === "abastecimento") {
      setTempAbastecimento({
        ...tempAbastecimento,
        [field]: event.target.value,
      });
    }
  };

  // Funções para Agentes
  const handleAddAgente = () => {
    if (tempAgente.nome.trim()) {
      if (editingAgente !== null) {
        const updatedAgentes = [...agentes];
        // Ensure unique ID for new entries, backend will assign real IDs later
        updatedAgentes[editingAgente] = {
          ...tempAgente,
          id: agentes[editingAgente].id || Date.now(),
        };
        setAgentes(updatedAgentes);
        setEditingAgente(null);
      } else {
        setAgentes([...agentes, { ...tempAgente, id: Date.now() }]);
      }
      setTempAgente({ nome: "", carga: "" });
    }
  };

  const handleEditAgente = (index) => {
    setTempAgente(agentes[index]);
    setEditingAgente(index);
  };

  const handleDeleteAgente = (index) => {
    setAgentes(agentes.filter((_, i) => i !== index));
  };

  // Funções para Motoristas
  const handleAddMotorista = () => {
    if (tempMotorista.nome.trim()) {
      if (editingMotorista !== null) {
        const updatedMotoristas = [...motoristas];
        updatedMotoristas[editingMotorista] = {
          ...tempMotorista,
          id: motoristas[editingMotorista].id || Date.now(),
        };
        setMotoristas(updatedMotoristas);
        setEditingMotorista(null);
      } else {
        setMotoristas([...motoristas, { ...tempMotorista, id: Date.now() }]);
      }
      setTempMotorista({ nome: "" });
    }
  };

  const handleEditMotorista = (index) => {
    setTempMotorista(motoristas[index]);
    setEditingMotorista(index);
  };

  const handleDeleteMotorista = (index) => {
    setMotoristas(motoristas.filter((_, i) => i !== index));
  };

  // Funções para Movimentações
  const handleAddMovimentacao = () => {
    if (tempMovimentacao.placa.trim()) {
      if (editingMovimentacao !== null) {
        const updatedMovimentacoes = [...movimentacoes];
        updatedMovimentacoes[editingMovimentacao] = {
          ...tempMovimentacao,
          id: movimentacoes[editingMovimentacao].id || Date.now(),
          abastecimentos:
            updatedMovimentacoes[editingMovimentacao].abastecimentos || [],
        };
        setMovimentacoes(updatedMovimentacoes);
        setEditingMovimentacao(null);
      } else {
        setMovimentacoes([
          ...movimentacoes,
          { ...tempMovimentacao, id: Date.now(), abastecimentos: [] },
        ]);
      }
      setTempMovimentacao({ placa: "", kmInicial: "", kmFinal: "" });
    }
  };

  const handleEditMovimentacao = (index) => {
    setTempMovimentacao({
      placa: movimentacoes[index].placa,
      kmInicial: movimentacoes[index].kmInicial,
      kmFinal: movimentacoes[index].kmFinal,
    });
    setEditingMovimentacao(index);
  };

  const handleDeleteMovimentacao = (index) => {
    // Se a movimentação que está sendo excluída é a selecionada para abastecimento, limpar a seleção
    if (selectedMovimentacao === index) {
      setSelectedMovimentacao(null);
      setTempAbastecimento({ kmAbastecido: "", valorPago: "" });
      setEditingAbastecimento(null);
    }

    // Ajustar o índice da movimentação selecionada se necessário
    if (selectedMovimentacao !== null && selectedMovimentacao > index) {
      setSelectedMovimentacao(selectedMovimentacao - 1);
    }

    setMovimentacoes(movimentacoes.filter((_, i) => i !== index));
  };

  // Funções para Abastecimentos
  const handleSelectMovimentacaoForAbastecimento = (index) => {
    setSelectedMovimentacao(index);
    setTempAbastecimento({ kmAbastecido: "", valorPago: "" });
    setEditingAbastecimento(null);
  };

  const handleAddAbastecimento = () => {
    if (
      selectedMovimentacao !== null &&
      tempAbastecimento.kmAbastecido.trim() &&
      tempAbastecimento.valorPago.trim() // Ensure value is also not empty
    ) {
      const updatedMovimentacoes = [...movimentacoes];
      const currentMovimentacao = updatedMovimentacoes[selectedMovimentacao];

      if (editingAbastecimento !== null) {
        // Editando abastecimento existente
        currentMovimentacao.abastecimentos[editingAbastecimento] = {
          ...tempAbastecimento,
          id:
            currentMovimentacao.abastecimentos[editingAbastecimento].id ||
            Date.now(),
        };
        setEditingAbastecimento(null);
      } else {
        // Adicionando novo abastecimento
        if (!currentMovimentacao.abastecimentos) {
          currentMovimentacao.abastecimentos = [];
        }
        currentMovimentacao.abastecimentos.push({
          ...tempAbastecimento,
          id: Date.now(),
        });
      }

      setMovimentacoes(updatedMovimentacoes);
      setTempAbastecimento({ kmAbastecido: "", valorPago: "" });
    }
  };

  const handleEditAbastecimento = (abastIndex) => {
    if (selectedMovimentacao !== null) {
      const abastecimento =
        movimentacoes[selectedMovimentacao].abastecimentos[abastIndex];
      setTempAbastecimento({
        kmAbastecido: abastecimento.kmAbastecido,
        valorPago: abastecimento.valorPago,
      });
      setEditingAbastecimento(abastIndex);
    }
  };

  const handleDeleteAbastecimento = (abastIndex) => {
    if (selectedMovimentacao !== null) {
      const updatedMovimentacoes = [...movimentacoes];
      updatedMovimentacoes[selectedMovimentacao].abastecimentos =
        updatedMovimentacoes[selectedMovimentacao].abastecimentos.filter(
          (_, i) => i !== abastIndex
        );
      setMovimentacoes(updatedMovimentacoes);

      // Se estava editando este abastecimento, cancelar a edição
      if (editingAbastecimento === abastIndex) {
        setEditingAbastecimento(null);
        setTempAbastecimento({ kmAbastecido: "", valorPago: "" });
      }
    }
  };

  const handleCancelAbastecimento = () => {
    setSelectedMovimentacao(null);
    setTempAbastecimento({ kmAbastecido: "", valorPago: "" });
    setEditingAbastecimento(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format data to match backend expectations
    const plantaoDataToSend = {
      data_inicio: formData.dataInicial
        ? formData.dataInicial.toISOString()
        : null,
      data_fim: formData.dataFinal ? formData.dataFinal.toISOString() : null,
      observacoes: formData.observacoes,
      status: formData.status,
      prioridade: formData.prioridade,
      local: formData.local,
      agentes: agentes.map((agent) => ({
        nome: agent.nome,
        cargo: agent.carga, // Assuming 'carga' maps to 'cargo' in backend
      })),
      motoristas: motoristas.map((driver) => ({
        nome: driver.nome,
      })),
      movimentacoes: movimentacoes.map((mov) => ({
        placa: mov.placa,
        kminicial: parseFloat(mov.kmInicial), // Ensure numbers are parsed
        kmfinal: parseFloat(mov.kmFinal), // Ensure numbers are parsed
        abastecimentos: mov.abastecimentos.map((abs) => ({
          kilometroabastecimento: parseFloat(abs.kmAbastecido), // Ensure numbers are parsed
          valor: parseFloat(abs.valorPago), // Ensure numbers are parsed
        })),
      })),
    };

    console.log("Sending Plantão Data:", plantaoDataToSend);
    dispatch(createPlantao(plantaoDataToSend));
  };

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

  const sectionStyle = {
    mb: 2,
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

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(0, 0, 0, 0.08)",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 1)",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
      "&.Mui-focused": {
        backgroundColor: "rgba(255, 255, 255, 1)",
        transform: "translateY(-2px)",
        boxShadow: "0 2px 24px rgba(99, 102, 241, 0.2)",
      },
      "& fieldset": {
        border: "none",
      },
      "& .MuiInputAdornment-root": {
        margin: 0,
        padding: 0,
      },
      "& .MuiSvgIcon-root": {
        backgroundColor: "transparent",
        border: "none",
      },
    },
    "& .MuiInputLabel-root": {
      fontWeight: 500,
      "&.Mui-focused": {
        color: "#6366f1",
      },
      transform: "translate(14px, 11px) scale(1)",
      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, -9px) scale(0.75)",
      },
    },
  };

  const buttonStyle = {
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 600,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  };

  const sections = [
    {
      title: "Período do Plantão",
      icon: <TimeIcon />,
      color: "#6366f1",
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    },
    {
      title: "Agentes Responsáveis",
      icon: <SecurityIcon />,
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      title: "Motoristas",
      icon: <PersonIcon />,
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      title: "Movimentações da Viatura",
      icon: <DriveIcon />,
      color: "#3b82f6",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    },
    {
      title: "Abastecimentos",
      icon: <GasIcon />,
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
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
                      Novo Plantão
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
                {/* Período do Plantão */}
                <Box sx={sectionStyle}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          background: sections[0].gradient,
                          mr: 3,
                          boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
                        }}
                      >
                        {sections[0].icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            color: "#1f2937",
                            fontSize: "1.5rem",
                            mb: 0.5,
                          }}
                        >
                          {sections[0].title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6b7280",
                            fontSize: "1rem",
                          }}
                        >
                          Configure as informações principais do plantão
                        </Typography>
                      </Box>
                      <Chip
                        label="Obrigatório"
                        size="medium"
                        sx={{
                          background: sections[0].gradient,
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          height: "32px",
                          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                        }}
                      />
                    </Box>

                    {/* Cards de Data e Hora */}
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#374151",
                          mb: 3,
                          fontSize: "1.1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CalendarIcon
                          sx={{ color: sections[0].color, fontSize: 20 }}
                        />
                        Período de Duração
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              background:
                                "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
                              borderRadius: "16px",
                              p: 3,
                              border: "2px solid rgba(99, 102, 241, 0.1)",
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow:
                                  "0 12px 32px rgba(99, 102, 241, 0.15)",
                                border: "2px solid rgba(99, 102, 241, 0.2)",
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: sections[0].color,
                                mb: 2,
                                fontSize: "0.95rem",
                              }}
                            >
                              🕐 Início do Plantão
                            </Typography>
                            <DatePicker
                              label="Data e Hora Inicial"
                              value={formData.dataInicial}
                              onChange={handleDateChange("dataInicial")}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  variant="outlined"
                                  sx={{
                                    ...textFieldStyle,
                                    "& .MuiOutlinedInput-root": {
                                      ...textFieldStyle[
                                        "& .MuiOutlinedInput-root"
                                      ],
                                      backgroundColor:
                                        "rgba(255, 255, 255, 0.8)",
                                      "&:hover": {
                                        backgroundColor:
                                          "rgba(255, 255, 255, 0.95)",
                                        transform: "none",
                                        boxShadow:
                                          "0 2px 8px rgba(0, 0, 0, 0.08)",
                                      },
                                      "&.Mui-focused": {
                                        backgroundColor:
                                          "rgba(255, 255, 255, 1)",
                                        transform: "none",
                                        boxShadow:
                                          "0 0 0 3px rgba(99, 102, 241, 0.1)",
                                      },
                                    },
                                  }}
                                />
                              )}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              background:
                                "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)",
                              borderRadius: "16px",
                              p: 3,
                              border: "2px solid rgba(139, 92, 246, 0.1)",
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow:
                                  "0 12px 32px rgba(139, 92, 246, 0.15)",
                                border: "2px solid rgba(139, 92, 246, 0.2)",
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: sections[0].color,
                                mb: 2,
                                fontSize: "0.95rem",
                              }}
                            >
                              🕐 Término do Plantão
                            </Typography>
                            <DatePicker
                              label="Data e Hora Final"
                              value={formData.dataFinal}
                              onChange={handleDateChange("dataFinal")}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  variant="outlined"
                                  sx={{
                                    ...textFieldStyle,
                                    "& .MuiOutlinedInput-root": {
                                      ...textFieldStyle[
                                        "& .MuiOutlinedInput-root"
                                      ],
                                      backgroundColor:
                                        "rgba(255, 255, 255, 0.8)",
                                      "&:hover": {
                                        backgroundColor:
                                          "rgba(255, 255, 255, 0.95)",
                                        transform: "none",
                                        boxShadow:
                                          "0 2px 8px rgba(0, 0, 0, 0.08)",
                                      },
                                      "&.Mui-focused": {
                                        backgroundColor:
                                          "rgba(255, 255, 255, 1)",
                                        transform: "none",
                                        boxShadow:
                                          "0 0 0 3px rgba(139, 92, 246, 0.1)",
                                      },
                                    },
                                  }}
                                />
                              )}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Cards de Informações Adicionais */}
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#374151",
                          mb: 3,
                          fontSize: "1.1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <StatusIcon
                          sx={{ color: sections[0].color, fontSize: 20 }}
                        />
                        Informações do Plantão
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{
                              background:
                                "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)",
                              borderRadius: "16px",
                              p: 3,
                              border: "2px solid rgba(16, 185, 129, 0.1)",
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow:
                                  "0 12px 32px rgba(16, 185, 129, 0.15)",
                                border: "2px solid rgba(16, 185, 129, 0.2)",
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: "#10b981",
                                mb: 2,
                                fontSize: "0.95rem",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <StatusIcon sx={{ fontSize: 18 }} />
                              Status
                            </Typography>
                            <FormControl fullWidth>
                              <Select
                                value={formData.status}
                                onChange={handleInputChange("main", "status")}
                                sx={{
                                  borderRadius: "12px",
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                  },
                                  "&:hover": {
                                    backgroundColor:
                                      "rgba(255, 255, 255, 0.95)",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                                  },
                                  "&.Mui-focused": {
                                    backgroundColor: "rgba(255, 255, 255, 1)",
                                    boxShadow:
                                      "0 0 0 3px rgba(16, 185, 129, 0.1)",
                                  },
                                }}
                              >
                                <MenuItem value="Ativo">✅ Ativo</MenuItem>
                                <MenuItem value="Concluído">
                                  ✔️ Concluído
                                </MenuItem>
                                <MenuItem value="Cancelado">
                                  ❌ Cancelado
                                </MenuItem>
                                <MenuItem value="Em Andamento">
                                  ⏳ Em Andamento
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{
                              background:
                                "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)",
                              borderRadius: "16px",
                              p: 3,
                              border: "2px solid rgba(245, 158, 11, 0.1)",
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow:
                                  "0 12px 32px rgba(245, 158, 11, 0.15)",
                                border: "2px solid rgba(245, 158, 11, 0.2)",
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: "#f59e0b",
                                mb: 2,
                                fontSize: "0.95rem",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <FlagIcon sx={{ fontSize: 18 }} />
                              Prioridade
                            </Typography>
                            <FormControl fullWidth>
                              <Select
                                value={formData.prioridade}
                                onChange={handleInputChange(
                                  "main",
                                  "prioridade"
                                )}
                                sx={{
                                  borderRadius: "12px",
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                  },
                                  "&:hover": {
                                    backgroundColor:
                                      "rgba(255, 255, 255, 0.95)",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                                  },
                                  "&.Mui-focused": {
                                    backgroundColor: "rgba(255, 255, 255, 1)",
                                    boxShadow:
                                      "0 0 0 3px rgba(245, 158, 11, 0.1)",
                                  },
                                }}
                              >
                                <MenuItem value="Baixa">🟢 Baixa</MenuItem>
                                <MenuItem value="Média">🟡 Média</MenuItem>
                                <MenuItem value="Alta">🟠 Alta</MenuItem>
                                <MenuItem value="Crítica">🔴 Crítica</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{
                              background:
                                "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(29, 78, 216, 0.05) 100%)",
                              borderRadius: "16px",
                              p: 3,
                              border: "2px solid rgba(59, 130, 246, 0.1)",
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow:
                                  "0 12px 32px rgba(59, 130, 246, 0.15)",
                                border: "2px solid rgba(59, 130, 246, 0.2)",
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: "#3b82f6",
                                mb: 2,
                                fontSize: "0.95rem",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <LocationIcon sx={{ fontSize: 18 }} />
                              Local
                            </Typography>
                            <TextField
                              fullWidth
                              placeholder="Ex: Setor A, Prédio Central..."
                              value={formData.local}
                              onChange={handleInputChange("main", "local")}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                  border: "none",
                                  "& fieldset": {
                                    border: "none",
                                  },
                                  "&:hover": {
                                    backgroundColor:
                                      "rgba(255, 255, 255, 0.95)",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                                  },
                                  "&.Mui-focused": {
                                    backgroundColor: "rgba(255, 255, 255, 1)",
                                    boxShadow:
                                      "0 0 0 3px rgba(59, 130, 246, 0.1)",
                                  },
                                },
                              }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Card de Observações */}
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#374151",
                          mb: 3,
                          fontSize: "1.1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        📝 Observações Adicionais
                      </Typography>

                      <Box
                        sx={{
                          background:
                            "linear-gradient(135deg, rgba(107, 114, 128, 0.05) 0%, rgba(75, 85, 99, 0.05) 100%)",
                          borderRadius: "16px",
                          p: 4,
                          border: "2px solid rgba(107, 114, 128, 0.1)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 32px rgba(107, 114, 128, 0.15)",
                            border: "2px solid rgba(107, 114, 128, 0.2)",
                          },
                        }}
                      >
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Adicione observações importantes sobre o plantão, instruções especiais, contatos de emergência, etc..."
                          value={formData.observacoes}
                          onChange={handleInputChange("main", "observacoes")}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              // Make background transparent to show parent Box's gradient
                              backgroundColor: "transparent",
                              border: "none",
                              "& fieldset": {
                                border: "none",
                              },
                              "&:hover": {
                                // Keep hover effect subtle without opaque background
                                backgroundColor: "transparent",
                                boxShadow: "none",
                              },
                              "&.Mui-focused": {
                                // Remove the blue outline/shadow on focus
                                backgroundColor: "transparent",
                                boxShadow: "none", // This is the key change
                              },
                            },
                            "& .MuiInputBase-input": {
                              fontSize: "1rem",
                              lineHeight: 1.6,
                              padding: "0 !important", // Remove default padding from input to fit better
                            },
                            // Remove default label styles if not needed for multiline/placeholder
                            "& .MuiInputLabel-root": {
                              display: "none", // Hide label if placeholder is sufficient
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Box>

                {/* Agentes Responsáveis */}
                <Box sx={sectionStyle}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          background: sections[1].gradient,
                          mr: 3,
                        }}
                      >
                        {sections[1].icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#1f2937",
                            fontSize: "1.3rem",
                          }}
                        >
                          {sections[1].title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6b7280",
                            mt: 0.5,
                          }}
                        >
                          Adicione os agentes responsáveis pelo plantão
                        </Typography>
                      </Box>
                    </Box>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={5}>
                        <TextField
                          fullWidth
                          label="Nome Completo do Agente"
                          value={tempAgente.nome}
                          onChange={handleInputChange("agente", "nome")}
                          sx={textFieldStyle}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <BadgeIcon sx={{ color: sections[1].color }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Cargo"
                          value={tempAgente.carga}
                          onChange={handleInputChange("agente", "carga")}
                          sx={textFieldStyle}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <WorkAgente sx={{ color: sections[1].color }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleAddAgente}
                          sx={{
                            ...buttonStyle,
                            height: "40px",
                            background: sections[1].gradient,
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #059669 0%, #047857 100%)",
                              transform: "translateY(-2px)",
                            },
                          }}
                          startIcon={<AddIcon />}
                        >
                          {editingAgente !== null ? "Atualizar" : "Adicionar"}
                        </Button>
                      </Grid>
                    </Grid>
                    {agentes.length > 0 && (
                      <TableContainer
                        component={Paper}
                        sx={{ borderRadius: "12px", mb: 2 }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow
                              sx={{
                                backgroundColor: "rgba(16, 185, 129, 0.1)",
                              }}
                            >
                              <TableCell sx={{ fontWeight: 700 }}>
                                Nome do Agente
                              </TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>
                                Cargo
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: 700, textAlign: "center" }}
                              >
                                Ações
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {agentes.map((agente, index) => (
                              <TableRow
                                key={agente.id}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.04)",
                                  },
                                }}
                              >
                                <TableCell>{agente.nome}</TableCell>
                                <TableCell>{agente.carga}</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  <IconButton
                                    onClick={() => handleEditAgente(index)}
                                    sx={{ color: sections[1].color, mr: 1 }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleDeleteAgente(index)}
                                    sx={{ color: "#ef4444" }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </CardContent>
                </Box>

                {/* Motoristas */}
                <Box sx={sectionStyle}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          background: sections[2].gradient,
                          mr: 3,
                        }}
                      >
                        {sections[2].icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#1f2937",
                            fontSize: "1.3rem",
                          }}
                        >
                          {sections[2].title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6b7280",
                            mt: 0.5,
                          }}
                        >
                          Adicione os motoristas responsáveis pelas viaturas
                        </Typography>
                      </Box>
                    </Box>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={9}>
                        <TextField
                          fullWidth
                          label="Nome Completo do Motorista"
                          value={tempMotorista.nome}
                          onChange={handleInputChange("motorista", "nome")}
                          sx={textFieldStyle}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon sx={{ color: sections[2].color }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleAddMotorista}
                          sx={{
                            ...buttonStyle,
                            height: "40px",
                            background: sections[2].gradient,
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                              transform: "translateY(-2px)",
                            },
                          }}
                          startIcon={<AddIcon />}
                        >
                          {editingMotorista !== null
                            ? "Atualizar"
                            : "Adicionar"}
                        </Button>
                      </Grid>
                    </Grid>
                    {motoristas.length > 0 && (
                      <TableContainer
                        component={Paper}
                        sx={{ borderRadius: "12px", mb: 2 }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow
                              sx={{
                                backgroundColor: "rgba(245, 158, 11, 0.1)",
                              }}
                            >
                              <TableCell sx={{ fontWeight: 700 }}>
                                Nome do Motorista
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: 700, textAlign: "center" }}
                              >
                                Ações
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {motoristas.map((motorista, index) => (
                              <TableRow
                                key={motorista.id}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.04)",
                                  },
                                }}
                              >
                                <TableCell>{motorista.nome}</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  <IconButton
                                    onClick={() => handleEditMotorista(index)}
                                    sx={{ color: sections[2].color, mr: 1 }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleDeleteMotorista(index)}
                                    sx={{ color: "#ef4444" }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </CardContent>
                </Box>

                {/* Movimentações da Viatura */}
                <Box sx={sectionStyle}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          background: sections[3].gradient,
                          mr: 3,
                        }}
                      >
                        {sections[3].icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#1f2937",
                            fontSize: "1.3rem",
                          }}
                        >
                          {sections[3].title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6b7280",
                            mt: 0.5,
                          }}
                        >
                          Registre as movimentações das viaturas
                        </Typography>
                      </Box>
                    </Box>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Placa da Viatura"
                          value={tempMovimentacao.placa}
                          onChange={handleInputChange("movimentacao", "placa")}
                          sx={textFieldStyle}
                          placeholder="ABC-1234"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CarIcon sx={{ color: sections[3].color }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="KM Inicial"
                          type="number"
                          value={tempMovimentacao.kmInicial}
                          onChange={handleInputChange(
                            "movimentacao",
                            "kmInicial"
                          )}
                          sx={textFieldStyle}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SpeedIcon sx={{ color: sections[3].color }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="KM Final"
                          type="number"
                          value={tempMovimentacao.kmFinal}
                          onChange={handleInputChange(
                            "movimentacao",
                            "kmFinal"
                          )}
                          sx={textFieldStyle}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SpeedIcon sx={{ color: sections[3].color }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleAddMovimentacao}
                          sx={{
                            ...buttonStyle,
                            height: "40px",
                            background: sections[3].gradient,
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                              transform: "translateY(-2px)",
                            },
                          }}
                          startIcon={<AddIcon />}
                        >
                          {editingMovimentacao !== null
                            ? "Atualizar"
                            : "Adicionar"}
                        </Button>
                      </Grid>
                    </Grid>
                    {movimentacoes.length > 0 && (
                      <TableContainer
                        component={Paper}
                        sx={{ borderRadius: "12px", mb: 2 }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow
                              sx={{
                                backgroundColor: "rgba(59, 130, 246, 0.1)",
                              }}
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
                                Abastecimentos
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: 700, textAlign: "center" }}
                              >
                                Ações
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {movimentacoes.map((mov, index) => (
                              <TableRow
                                key={mov.id}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.04)",
                                  },
                                  backgroundColor:
                                    selectedMovimentacao === index
                                      ? "rgba(59, 130, 246, 0.05)"
                                      : "transparent",
                                }}
                              >
                                <TableCell>{mov.placa}</TableCell>
                                <TableCell>{mov.kmInicial} km</TableCell>
                                <TableCell>{mov.kmFinal} km</TableCell>
                                <TableCell>
                                  {mov.kmFinal && mov.kmInicial
                                    ? `${mov.kmFinal - mov.kmInicial} km`
                                    : "-"}
                                </TableCell>
                                <TableCell>
                                  {mov.abastecimentos &&
                                  mov.abastecimentos.length > 0 ? (
                                    <Chip
                                      icon={<CheckCircleIcon />}
                                      label={`${
                                        mov.abastecimentos.length
                                      } abastecimento${
                                        mov.abastecimentos.length > 1 ? "s" : ""
                                      }`}
                                      size="small"
                                      sx={{
                                        background:
                                          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                        color: "white",
                                        fontWeight: 600,
                                      }}
                                    />
                                  ) : (
                                    <Chip
                                      label="Sem abastecimento"
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        borderColor: "#6b7280",
                                        color: "#6b7280",
                                      }}
                                    />
                                  )}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  <IconButton
                                    onClick={() =>
                                      handleEditMovimentacao(index)
                                    }
                                    sx={{ color: sections[3].color, mr: 1 }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() =>
                                      handleSelectMovimentacaoForAbastecimento(
                                        index
                                      )
                                    }
                                    sx={{
                                      color:
                                        selectedMovimentacao === index
                                          ? "#10b981"
                                          : "#ef4444",
                                      mr: 1,
                                      "&:hover": {
                                        backgroundColor:
                                          selectedMovimentacao === index
                                            ? "rgba(16, 185, 129, 0.1)"
                                            : "rgba(239, 68, 68, 0.1)",
                                      },
                                    }}
                                    title="Gerenciar abastecimentos"
                                  >
                                    <GasIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() =>
                                      handleDeleteMovimentacao(index)
                                    }
                                    sx={{ color: "#ef4444" }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </CardContent>
                </Box>

                {/* Seção de Abastecimento - Só aparece quando uma movimentação é selecionada */}
                {selectedMovimentacao !== null && (
                  <Box sx={sectionStyle}>
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 4 }}
                      >
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            background: sections[4].gradient,
                            mr: 3,
                          }}
                        >
                          {sections[4].icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: "#1f2937",
                              fontSize: "1.3rem",
                            }}
                          >
                            Abastecimentos -{" "}
                            {movimentacoes[selectedMovimentacao]?.placa}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#6b7280",
                              mt: 0.5,
                            }}
                          >
                            Gerencie os abastecimentos para esta movimentação
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={handleCancelAbastecimento}
                          sx={{
                            color: "#6b7280",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>

                      <Alert
                        severity="info"
                        sx={{ mb: 3, borderRadius: "12px" }}
                      >
                        Gerenciando abastecimentos para a viatura{" "}
                        <strong>
                          {movimentacoes[selectedMovimentacao]?.placa}
                        </strong>
                      </Alert>

                      <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="KM no Abastecimento"
                            type="number"
                            value={tempAbastecimento.kmAbastecido}
                            onChange={handleInputChange(
                              "abastecimento",
                              "kmAbastecido"
                            )}
                            sx={textFieldStyle}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SpeedIcon
                                    sx={{ color: sections[4].color }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Valor Pago (R$)"
                            type="number"
                            value={tempAbastecimento.valorPago}
                            onChange={handleInputChange(
                              "abastecimento",
                              "valorPago"
                            )}
                            sx={textFieldStyle}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <MoneyIcon
                                    sx={{ color: sections[4].color }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={handleAddAbastecimento}
                            sx={{
                              ...buttonStyle,
                              height: "40px",
                              background: sections[4].gradient,
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                                transform: "translateY(-2px)",
                              },
                            }}
                            startIcon={
                              editingAbastecimento !== null ? (
                                <EditIcon />
                              ) : (
                                <AddIcon />
                              )
                            }
                          >
                            {editingAbastecimento !== null
                              ? "Atualizar"
                              : "Adicionar"}
                          </Button>
                        </Grid>
                      </Grid>

                      {/* Tabela de Abastecimentos */}
                      {movimentacoes[selectedMovimentacao]?.abastecimentos &&
                        movimentacoes[selectedMovimentacao].abastecimentos
                          .length > 0 && (
                          <TableContainer
                            component={Paper}
                            sx={{ borderRadius: "12px", mb: 2 }}
                          >
                            <Table>
                              <TableHead>
                                <TableRow
                                  sx={{
                                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                                  }}
                                >
                                  <TableCell sx={{ fontWeight: 700 }}>
                                    KM Abastecido
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 700 }}>
                                    Valor Pago
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: 700,
                                      textAlign: "center",
                                    }}
                                  >
                                    Ações
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {movimentacoes[
                                  selectedMovimentacao
                                ].abastecimentos.map((abast, index) => (
                                  <TableRow
                                    key={abast.id}
                                    sx={{
                                      "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.04)",
                                      },
                                      backgroundColor:
                                        editingAbastecimento === index
                                          ? "rgba(239, 68, 68, 0.05)"
                                          : "transparent",
                                    }}
                                  >
                                    <TableCell>
                                      {abast.kmAbastecido} km
                                    </TableCell>
                                    <TableCell>R$ {abast.valorPago}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                      <IconButton
                                        onClick={() =>
                                          handleEditAbastecimento(index)
                                        }
                                        sx={{
                                          color: sections[4].color,
                                          mr: 1,
                                        }}
                                      >
                                        <EditIcon />
                                      </IconButton>
                                      <IconButton
                                        onClick={() =>
                                          handleDeleteAbastecimento(index)
                                        }
                                        sx={{ color: "#ef4444" }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                    </CardContent>
                  </Box>
                )}

                {/* Botões de Ação */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
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
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading} // Disable button while loading
                    sx={{
                      borderRadius: "12px",
                      px: 4,
                      py: 1.5,
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
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Salvar Plantão"
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </LocalizationProvider>
  );
};

export default PlantaoModal;
