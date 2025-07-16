import { api, requestConfig } from "../utils/config"; // Certifique-se de que o caminho para 'config' está correto.

// Função auxiliar para obter o token do usuário
const getUserToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

/**
 * Serviço para gerenciar operações CRUD para Plantões e suas entidades relacionadas.
 */
export const plantaoService = {
  /**
   * Cadastra um novo plantão com todas as suas entidades relacionadas iniciais.
   * @param {object} data - Os dados completos do plantão, incluindo arrays de agentes, motoristas, etc.
   * @returns {Promise<object>} A resposta da API.
   */
  cadastrarPlantao: async (data) => {
    const token = getUserToken();
    const config = requestConfig("POST", data, token);

    try {
      const res = await fetch(api + "/plantao", config);
      const json = await res.json();

      if (!res.ok) {
        // Se a resposta não for OK (ex: 4xx, 5xx), lança um erro com a mensagem do backend
        throw new Error(
          json.errors ? json.errors.join(", ") : "Erro ao cadastrar plantão."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao cadastrar plantão:", error);
      // Retorna o erro para ser tratado no componente
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  /**
   * Atualiza os dados principais de um plantão existente.
   * Não lida com entidades relacionadas (agentes, motoristas, etc.).
   * @param {string} id - O ID do plantão a ser atualizado.
   * @param {object} data - Os dados do plantão a serem atualizados (ex: data_fim, observacoes).
   * @returns {Promise<object>} A resposta da API.
   */
  updatePlantao: async (id, data) => {
    const token = getUserToken();
    const config = requestConfig("PUT", data, token);

    try {
      const res = await fetch(api + `/plantao/${id}`, config);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors ? json.errors.join(", ") : "Erro ao atualizar plantão."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao atualizar plantão:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  // --- Funções para Agentes ---

  /**
   * Adiciona um novo agente a um plantão existente.
   * @param {string} plantaoId - O ID do plantão.
   * @param {object} agentData - Os dados do novo agente (ex: { nome: "...", cargo: "..." }).
   * @returns {Promise<object>} A resposta da API.
   */
  addAgent: async (plantaoId, agentData) => {
    const token = getUserToken();
    const config = requestConfig("POST", agentData, token);

    try {
      const res = await fetch(api + `/plantao/${plantaoId}/agentes`, config);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors ? json.errors.join(", ") : "Erro ao adicionar agente."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao adicionar agente:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  /**
   * Atualiza um agente específico de um plantão.
   * @param {string} plantaoId - O ID do plantão.
   * @param {string} agentId - O ID do agente a ser atualizado.
   * @param {object} agentData - Os dados do agente a serem atualizados.
   * @returns {Promise<object>} A resposta da API.
   */
  updateAgent: async (plantaoId, agentId, agentData) => {
    const token = getUserToken();
    const config = requestConfig("PUT", agentData, token);

    try {
      const res = await fetch(
        api + `/plantao/${plantaoId}/agentes/${agentId}`,
        config
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors ? json.errors.join(", ") : "Erro ao atualizar agente."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao atualizar agente:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  /**
   * Deleta um agente específico de um plantão.
   * @param {string} plantaoId - O ID do plantão.
   * @param {string} agentId - O ID do agente a ser deletado.
   * @returns {Promise<object>} A resposta da API.
   */
  deleteAgent: async (plantaoId, agentId) => {
    const token = getUserToken();
    const config = requestConfig("DELETE", null, token); // DELETE requests usually don't send a body

    try {
      const res = await fetch(
        api + `/plantao/${plantaoId}/agentes/${agentId}`,
        config
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors ? json.errors.join(", ") : "Erro ao deletar agente."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao deletar agente:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  // --- Funções para Motoristas ---

  /**
   * Adiciona um novo motorista a um plantão existente.
   * @param {string} plantaoId - O ID do plantão.
   * @param {object} driverData - Os dados do novo motorista (ex: { nome: "..." }).
   * @returns {Promise<object>} A resposta da API.
   */
  addMotorista: async (plantaoId, driverData) => {
    const token = getUserToken();
    const config = requestConfig("POST", driverData, token);

    try {
      const res = await fetch(api + `/plantao/${plantaoId}/motoristas`, config);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors ? json.errors.join(", ") : "Erro ao adicionar motorista."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao adicionar motorista:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  /**
   * Atualiza um motorista específico de um plantão.
   * @param {string} plantaoId - O ID do plantão.
   * @param {string} driverId - O ID do motorista a ser atualizado.
   * @param {object} driverData - Os dados do motorista a serem atualizados.
   * @returns {Promise<object>} A resposta da API.
   */
  updateMotorista: async (plantaoId, driverId, driverData) => {
    const token = getUserToken();
    const config = requestConfig("PUT", driverData, token);

    try {
      const res = await fetch(
        api + `/plantao/${plantaoId}/motoristas/${driverId}`,
        config
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors ? json.errors.join(", ") : "Erro ao atualizar motorista."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao atualizar motorista:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  /**
   * Deleta um motorista específico de um plantão.
   * @param {string} plantaoId - O ID do plantão.
   * @param {string} driverId - O ID do motorista a ser deletado.
   * @returns {Promise<object>} A resposta da API.
   */
  deleteMotorista: async (plantaoId, driverId) => {
    const token = getUserToken();
    const config = requestConfig("DELETE", null, token);

    try {
      const res = await fetch(
        api + `/plantao/${plantaoId}/motoristas/${driverId}`,
        config
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors ? json.errors.join(", ") : "Erro ao deletar motorista."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao deletar motorista:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  // --- Funções para Movimentações da Viatura ---

  /**
   * Adiciona uma nova movimentação de viatura a um plantão existente.
   * @param {string} plantaoId - O ID do plantão.
   * @param {object} movementData - Os dados da nova movimentação (ex: { placa: "...", kminicial: ..., kmfinal: ... }).
   * @returns {Promise<object>} A resposta da API.
   */
  addMovimentacao: async (plantaoId, movementData) => {
    const token = getUserToken();
    const config = requestConfig("POST", movementData, token);

    try {
      const res = await fetch(
        api + `/plantao/${plantaoId}/movimentacoes`,
        config
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors
            ? json.errors.join(", ")
            : "Erro ao adicionar movimentação."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao adicionar movimentação:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  /**
   * Atualiza uma movimentação de viatura específica de um plantão.
   * @param {string} plantaoId - O ID do plantão.
   * @param {string} movementId - O ID da movimentação a ser atualizada.
   * @param {object} movementData - Os dados da movimentação a serem atualizados.
   * @returns {Promise<object>} A resposta da API.
   */
  updateMovimentacao: async (plantaoId, movementId, movementData) => {
    const token = getUserToken();
    const config = requestConfig("PUT", movementData, token);

    try {
      const res = await fetch(
        api + `/plantao/${plantaoId}/movimentacoes/${movementId}`,
        config
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors
            ? json.errors.join(", ")
            : "Erro ao atualizar movimentação."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao atualizar movimentação:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  /**
   * Deleta uma movimentação de viatura específica de um plantão.
   * @param {string} plantaoId - O ID do plantão.
   * @param {string} movementId - O ID da movimentação a ser deletada.
   * @returns {Promise<object>} A resposta da API.
   */
  deleteMovimentacao: async (plantaoId, movementId) => {
    const token = getUserToken();
    const config = requestConfig("DELETE", null, token);

    try {
      const res = await fetch(
        api + `/plantao/${plantaoId}/movimentacoes/${movementId}`,
        config
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors ? json.errors.join(", ") : "Erro ao deletar movimentação."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao deletar movimentação:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  // --- Funções para Abastecimentos ---

  /**
   * Adiciona um novo abastecimento a um plantão existente.
   * @param {string} plantaoId - O ID do plantão.
   * @param {object} fuelingData - Os dados do novo abastecimento (ex: { placa: "...", valor: ..., kilometroabastecimento: ... }).
   * @returns {Promise<object>} A resposta da API.
   */
  addAbastecimento: async (plantaoId, fuelingData) => {
    const token = getUserToken();
    const config = requestConfig("POST", fuelingData, token);

    try {
      const res = await fetch(
        api + `/plantao/${plantaoId}/abastecimentos`,
        config
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors
            ? json.errors.join(", ")
            : "Erro ao adicionar abastecimento."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao adicionar abastecimento:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  /**
   * Atualiza um abastecimento específico de um plantão.
   * @param {string} plantaoId - O ID do plantão.
   * @param {string} fuelingId - O ID do abastecimento a ser atualizado.
   * @param {object} fuelingData - Os dados do abastecimento a serem atualizados.
   * @returns {Promise<object>} A resposta da API.
   */
  updateAbastecimento: async (plantaoId, fuelingId, fuelingData) => {
    const token = getUserToken();
    const config = requestConfig("PUT", fuelingData, token);

    try {
      const res = await fetch(
        api + `/plantao/${plantaoId}/abastecimentos/${fuelingId}`,
        config
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors
            ? json.errors.join(", ")
            : "Erro ao atualizar abastecimento."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao atualizar abastecimento:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  /**
   * Deleta um abastecimento específico de um plantão.
   * @param {string} plantaoId - O ID do plantão.
   * @param {string} fuelingId - O ID do abastecimento a ser deletado.
   * @returns {Promise<object>} A resposta da API.
   */
  deleteAbastecimento: async (plantaoId, fuelingId) => {
    const token = getUserToken();
    const config = requestConfig("DELETE", null, token);

    try {
      const res = await fetch(
        api + `/plantao/${plantaoId}/abastecimentos/${fuelingId}`,
        config
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors
            ? json.errors.join(", ")
            : "Erro ao deletar abastecimento."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao deletar abastecimento:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  /**
   * Busca todos os plantões.
   * @returns {Promise<Array<object>>} Uma lista de plantões.
   */
  getAllPlantoes: async () => {
    const token = getUserToken();
    const config = requestConfig("GET", null, token);

    try {
      const res = await fetch(api + "/plantao", config);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors ? json.errors.join(", ") : "Erro ao buscar plantões."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao buscar plantões:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },

  /**
   * Busca um plantão por ID.
   * @param {string} id - O ID do plantão.
   * @returns {Promise<object>} O plantão encontrado.
   */
  getPlantaoById: async (id) => {
    const token = getUserToken();
    const config = requestConfig("GET", null, token);

    try {
      const res = await fetch(api + `/plantao/${id}`, config);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.errors ? json.errors.join(", ") : "Plantão não encontrado."
        );
      }

      return json;
    } catch (error) {
      console.error("Erro ao buscar plantão por ID:", error);
      return { errors: [error.message || "Ocorreu um erro desconhecido."] };
    }
  },
};

export default plantaoService;
