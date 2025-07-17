import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { plantaoService } from "../services/plantaoService"; // Garanta que este caminho está correto

const initialState = {
  plantoes: [],
  plantao: null,
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Async Thunks (sem alterações aqui, elas já estão corretas)
export const createPlantao = createAsyncThunk(
  "plantao/create",
  async (plantaoData, thunkAPI) => {
    const data = await plantaoService.cadastrarPlantao(plantaoData);
    if (data.errors) return thunkAPI.rejectWithValue(data.errors[0]);
    return data;
  }
);

export const updatePlantao = createAsyncThunk(
  "plantao/update",
  async ({ id, plantaoData }, thunkAPI) => {
    const data = await plantaoService.updatePlantao(id, plantaoData);
    if (data.errors) return thunkAPI.rejectWithValue(data.errors[0]);
    return data;
  }
);

export const getAllPlantoes = createAsyncThunk(
  "plantao/getAll",
  async (_, thunkAPI) => {
    const data = await plantaoService.getAllPlantoes();
    if (data.errors) return thunkAPI.rejectWithValue(data.errors[0]);
    return data;
  }
);

// ... (todos os outros async thunks como addAgent, deleteAgent, etc. permanecem os mesmos)
// Get plantao by ID
export const getPlantaoById = createAsyncThunk(
  "plantao/getById",
  async (id, thunkAPI) => {
    const data = await plantaoService.getPlantaoById(id);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);
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
    // A função reset continua a mesma, está correta.
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
        state.error = false;
        state.message = "Plantão criado com sucesso!"; // Define uma mensagem de sucesso explícita
        // **CORREÇÃO PRINCIPAL**: Não fazemos mais o push aqui.
        // A responsabilidade de atualizar a lista é do getAllPlantoes,
        // que já é chamado pelo componente.
      })
      .addCase(createPlantao.rejected, (state, action) => {
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
        // Não alteramos o 'success' aqui para não re-acionar o useEffect desnecessariamente
        state.error = false;
        // **CORREÇÃO DE SEGURANÇA**: Garante que o payload é um array antes de atribuir
        if (Array.isArray(action.payload)) {
          state.plantoes = action.payload;
        }
      })
      .addCase(getAllPlantoes.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
        // **CORREÇÃO DE SEGURANÇA**: Não limpa a lista em caso de falha,
        // para não causar uma tela branca se a UI já estiver mostrando dados.
        // state.plantoes = []; // Linha removida
      })

      // ... (todos os outros extraReducers para update, delete, getById, etc. permanecem os mesmos)
      // Update Plantao
      .addCase(updatePlantao.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updatePlantao.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.message = action.payload.message;
        if (Array.isArray(state.plantoes)) {
          state.plantoes = state.plantoes.map((p) =>
            p.id === action.payload.plantao.id ? action.payload.plantao : p
          );
        }
      })
      .addCase(updatePlantao.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      // Get Plantao By Id
      .addCase(getPlantaoById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getPlantaoById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.plantao = action.payload;
      })
      .addCase(getPlantaoById.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
        state.plantao = null;
      });
    // Adicione os outros cases para agentes, motoristas, etc. se necessário, seguindo a mesma lógica.
  },
});

export const { reset } = plantaoSlice.actions;
export default plantaoSlice.reducer;
