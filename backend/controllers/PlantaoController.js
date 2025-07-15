const Plantao = require("../models/Plantao");

/**
 * Controller para criar um novo plantão com qualquer combinação de dados relacionados.
 */
const create = async (req, res) => {
  // Extrai todos os possíveis dados do corpo da requisição
  const {
    data_inicio,
    data_fim,
    observacoes,
    agentes,
    motoristas,
    movimentacoes,
    abastecimentos,
  } = req.body;

  if (!data_inicio) {
    return res.status(422).json({ errors: ["Data de início é obrigatória."] });
  }

  try {
    // Organiza os dados para o Model
    const plantaoData = { data_inicio, data_fim, observacoes };
    const relacionados = { agentes, motoristas, movimentacoes, abastecimentos };

    const novoPlantao = await Plantao.create(plantaoData, relacionados);

    res.status(201).json({
      message: "Plantão criado com sucesso!",
      plantaoId: novoPlantao.id,
    });
  } catch (error) {
    console.error("Erro no controller ao criar plantão:", error);
    res
      .status(500)
      .json({ errors: ["Ocorreu um erro interno ao criar o plantão."] });
  }
};

/**
 * Controller para atualizar um plantão e/ou adicionar novas entidades relacionadas.
 */
const update = async (req, res) => {
  const { id } = req.params;
  const {
    data_fim,
    observacoes,
    agentes,
    motoristas,
    movimentacoes,
    abastecimentos,
  } = req.body;

  try {
    const plantaoData = { data_fim, observacoes };
    const relacionados = { agentes, motoristas, movimentacoes, abastecimentos };

    const plantaoAtualizado = await Plantao.update(
      id,
      plantaoData,
      relacionados
    );

    if (!plantaoAtualizado) {
      return res.status(404).json({ errors: ["Plantão não encontrado."] });
    }

    res.status(200).json({
      message: "Plantão atualizado com sucesso!",
      plantao: plantaoAtualizado,
    });
  } catch (error) {
    console.error("Erro no controller ao atualizar plantão:", error);
    res
      .status(500)
      .json({ errors: ["Ocorreu um erro interno ao atualizar o plantão."] });
  }
};

const getAllPlantoes = async (req, res) => {
  try {
    const plantoes = await Plantao.findAll();
    res.status(200).json(plantoes);
  } catch (error) {
    console.error("Erro no controller ao buscar plantões:", error);
    res
      .status(500)
      .json({ errors: ["Ocorreu um erro ao buscar os plantões."] });
  }
};

module.exports = {
  create,
  update,
  getAllPlantoes,
};
