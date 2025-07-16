import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { plantaoService } from "../services/plantaoService"; // Ensure this path is correct

const initialState = {
  plantoes: [],
  plantao: null,
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Async Thunks for Plantao operations

// Create a new plantao
export const createPlantao = createAsyncThunk(
  "plantao/create",
  async (plantaoData, thunkAPI) => {
    const data = await plantaoService.cadastrarPlantao(plantaoData);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Update a plantao
export const updatePlantao = createAsyncThunk(
  "plantao/update",
  async ({ id, plantaoData }, thunkAPI) => {
    const data = await plantaoService.updatePlantao(id, plantaoData);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Get all plantoes
export const getAllPlantoes = createAsyncThunk(
  "plantao/getAll",
  async (_, thunkAPI) => {
    const data = await plantaoService.getAllPlantoes();

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Get plantao by ID
export const getPlantaoById = createAsyncThunk(
  "plantao/getById",
  async (id, thunkAPI) => {
    const data = await plantaoService.getPlantaoById(id);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Async Thunks for nested entities (Agentes, Motoristas, Movimentacoes, Abastecimentos)

// Add Agent
export const addAgent = createAsyncThunk(
  "plantao/addAgent",
  async ({ plantaoId, agentData }, thunkAPI) => {
    const data = await plantaoService.addAgent(plantaoId, agentData);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Update Agent
export const updateAgent = createAsyncThunk(
  "plantao/updateAgent",
  async ({ plantaoId, agentId, agentData }, thunkAPI) => {
    const data = await plantaoService.updateAgent(
      plantaoId,
      agentId,
      agentData
    );
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Delete Agent
export const deleteAgent = createAsyncThunk(
  "plantao/deleteAgent",
  async ({ plantaoId, agentId }, thunkAPI) => {
    const data = await plantaoService.deleteAgent(plantaoId, agentId);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Add Motorista
export const addMotorista = createAsyncThunk(
  "plantao/addMotorista",
  async ({ plantaoId, driverData }, thunkAPI) => {
    const data = await plantaoService.addMotorista(plantaoId, driverData);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Update Motorista
export const updateMotorista = createAsyncThunk(
  "plantao/updateMotorista",
  async ({ plantaoId, driverId, driverData }, thunkAPI) => {
    const data = await plantaoService.updateMotorista(
      plantaoId,
      driverId,
      driverData
    );
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Delete Motorista
export const deleteMotorista = createAsyncThunk(
  "plantao/deleteMotorista",
  async ({ plantaoId, driverId }, thunkAPI) => {
    const data = await plantaoService.deleteMotorista(plantaoId, driverId);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Add Movimentacao
export const addMovimentacao = createAsyncThunk(
  "plantao/addMovimentacao",
  async ({ plantaoId, movementData }, thunkAPI) => {
    const data = await plantaoService.addMovimentacao(plantaoId, movementData);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Update Movimentacao
export const updateMovimentacao = createAsyncThunk(
  "plantao/updateMovimentacao",
  async ({ plantaoId, movementId, movementData }, thunkAPI) => {
    const data = await plantaoService.updateMovimentacao(
      plantaoId,
      movementId,
      movementData
    );
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Delete Movimentacao
export const deleteMovimentacao = createAsyncThunk(
  "plantao/deleteMovimentacao",
  async ({ plantaoId, movementId }, thunkAPI) => {
    const data = await plantaoService.deleteMovimentacao(plantaoId, movementId);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Add Abastecimento
export const addAbastecimento = createAsyncThunk(
  "plantao/addAbastecimento",
  async ({ plantaoId, fuelingData }, thunkAPI) => {
    const data = await plantaoService.addAbastecimento(plantaoId, fuelingData);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Update Abastecimento
export const updateAbastecimento = createAsyncThunk(
  "plantao/updateAbastecimento",
  async ({ plantaoId, fuelingId, fuelingData }, thunkAPI) => {
    const data = await plantaoService.updateAbastecimento(
      plantaoId,
      fuelingId,
      fuelingData
    );
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Delete Abastecimento
export const deleteAbastecimento = createAsyncThunk(
  "plantao/deleteAbastecimento",
  async ({ plantaoId, fuelingId }, thunkAPI) => {
    const data = await plantaoService.deleteAbastecimento(plantaoId, fuelingId);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const plantaoSlice = createSlice({
  name: "plantao",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Plantao
      .addCase(createPlantao.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(createPlantao.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        state.plantoes.push(action.payload.plantao); // Assuming payload returns the created plantao
      })
      .addCase(createPlantao.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
        state.plantao = null;
      })
      // Update Plantao
      .addCase(updatePlantao.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updatePlantao.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        state.plantoes = state.plantoes.map((plantao) =>
          plantao.id === action.payload.plantao.id
            ? action.payload.plantao
            : plantao
        );
      })
      .addCase(updatePlantao.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      // Get All Plantoes
      .addCase(getAllPlantoes.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAllPlantoes.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.plantoes = action.payload;
      })
      .addCase(getAllPlantoes.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
        state.plantoes = [];
      })
      // Get Plantao By Id
      .addCase(getPlantaoById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getPlantaoById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.plantao = action.payload;
      })
      .addCase(getPlantaoById.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
        state.plantao = null;
      })
      // Add Agent
      .addCase(addAgent.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(addAgent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        // Optionally update the specific plantao if it's in the state
        if (state.plantao && state.plantao.id === action.payload.plantaoId) {
          state.plantao.agentes.push(action.payload.agent); // Assuming payload returns the added agent
        }
      })
      .addCase(addAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      // Update Agent
      .addCase(updateAgent.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateAgent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        if (state.plantao && state.plantao.id === action.payload.plantaoId) {
          state.plantao.agentes = state.plantao.agentes.map((agent) =>
            agent.id === action.payload.agent.id ? action.payload.agent : agent
          );
        }
      })
      .addCase(updateAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      // Delete Agent
      .addCase(deleteAgent.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteAgent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        if (state.plantao && state.plantao.id === action.payload.plantaoId) {
          state.plantao.agentes = state.plantao.agentes.filter(
            (agent) => agent.id !== action.payload.agentId
          );
        }
      })
      .addCase(deleteAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      // Add Motorista
      .addCase(addMotorista.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(addMotorista.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        if (state.plantao && state.plantao.id === action.payload.plantaoId) {
          state.plantao.motoristas.push(action.payload.motorista);
        }
      })
      .addCase(addMotorista.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      // Update Motorista
      .addCase(updateMotorista.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateMotorista.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        if (state.plantao && state.plantao.id === action.payload.plantaoId) {
          state.plantao.motoristas = state.plantao.motoristas.map((motorista) =>
            motorista.id === action.payload.motorista.id
              ? action.payload.motorista
              : motorista
          );
        }
      })
      .addCase(updateMotorista.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      // Delete Motorista
      .addCase(deleteMotorista.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteMotorista.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        if (state.plantao && state.plantao.id === action.payload.plantaoId) {
          state.plantao.motoristas = state.plantao.motoristas.filter(
            (motorista) => motorista.id !== action.payload.motoristaId
          );
        }
      })
      .addCase(deleteMotorista.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      // Add Movimentacao
      .addCase(addMovimentacao.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(addMovimentacao.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        if (state.plantao && state.plantao.id === action.payload.plantaoId) {
          state.plantao.movimentacoes.push(action.payload.movimentacao);
        }
      })
      .addCase(addMovimentacao.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      // Update Movimentacao
      .addCase(updateMovimentacao.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateMovimentacao.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        if (state.plantao && state.plantao.id === action.payload.plantaoId) {
          state.plantao.movimentacoes = state.plantao.movimentacoes.map((mov) =>
            mov.id === action.payload.movimentacao.id
              ? action.payload.movimentacao
              : mov
          );
        }
      })
      .addCase(updateMovimentacao.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      // Delete Movimentacao
      .addCase(deleteMovimentacao.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteMovimentacao.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        if (state.plantao && state.plantao.id === action.payload.plantaoId) {
          state.plantao.movimentacoes = state.plantao.movimentacoes.filter(
            (mov) => mov.id !== action.payload.movimentacaoId
          );
        }
      })
      .addCase(deleteMovimentacao.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      // Add Abastecimento
      .addCase(addAbastecimento.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(addAbastecimento.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        if (state.plantao && state.plantao.id === action.payload.plantaoId) {
          state.plantao.abastecimentos.push(action.payload.abastecimento);
        }
      })
      .addCase(addAbastecimento.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      // Update Abastecimento
      .addCase(updateAbastecimento.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateAbastecimento.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        if (state.plantao && state.plantao.id === action.payload.plantaoId) {
          state.plantao.abastecimentos = state.plantao.abastecimentos.map(
            (abs) =>
              abs.id === action.payload.abastecimento.id
                ? action.payload.abastecimento
                : abs
          );
        }
      })
      .addCase(updateAbastecimento.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      // Delete Abastecimento
      .addCase(deleteAbastecimento.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteAbastecimento.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        if (state.plantao && state.plantao.id === action.payload.plantaoId) {
          state.plantao.abastecimentos = state.plantao.abastecimentos.filter(
            (abs) => abs.id !== action.payload.abastecimentoId
          );
        }
      })
      .addCase(deleteAbastecimento.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = plantaoSlice.actions;
export default plantaoSlice.reducer;
