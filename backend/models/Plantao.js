// models/Plantao.js

const { pool } = require("../config/db");

/**
 * Função auxiliar para inserir entidades relacionadas.
 * @param {object} client - O cliente de conexão do banco de dados.
 * @param {string} tabela - O nome da tabela (ex: "agentes").
 * @param {array} itens - O array de itens a serem inseridos.
 * @param {number} plantaoId - O ID do plantão pai.
 */
const inserirRelacionados = async (client, tabela, itens, plantaoId) => {
  if (!itens || itens.length === 0) {
    return; // Se não houver itens, não faz nada.
  }

  // Mapeia os campos de cada tabela. Adicione novas tabelas aqui se precisar.
  const camposMap = {
    agentes: ["nome", "cargo"],
    motorista: ["nome"],
    movimentacaoviatura: ["placa", "kminicial", "kmfinal"],
    abastecimentoviatura: ["placa", "valor", "kilometroabastecimento"],
  };

  const campos = camposMap[tabela];
  if (!campos) {
    throw new Error(`Tabela relacionada desconhecida: ${tabela}`);
  }

  const placeholders = campos.map((_, index) => `$${index + 1}`).join(", "); // Cria $1, $2, ...
  const query = `INSERT INTO ${tabela} (${campos.join(
    ", "
  )}, plantao_id) VALUES (${placeholders}, $${campos.length + 1})`;

  for (const item of itens) {
    const valores = campos.map((campo) => item[campo]); // Pega os valores do item
    await client.query(query, [...valores, plantaoId]);
  }
};

/**
 * Cria um novo plantão e, opcionalmente, todas as suas entidades relacionadas.
 * @param {object} plantaoData - Dados principais do plantão.
 * @param {object} relacionados - Objeto contendo arrays para cada entidade.
 */
const create = async (plantaoData, relacionados = {}) => {
  const { data_inicio, data_fim, observacoes } = plantaoData;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Insere o plantão principal
    const plantaoQuery = `INSERT INTO plantao (data_inicio, data_fim, observacoes) VALUES ($1, $2, $3) RETURNING id;`;
    const resultPlantao = await client.query(plantaoQuery, [
      data_inicio,
      data_fim,
      observacoes,
    ]);
    const plantaoId = resultPlantao.rows[0].id;

    // 2. Insere todas as entidades relacionadas que foram fornecidas
    await inserirRelacionados(
      client,
      "agentes",
      relacionados.agentes,
      plantaoId
    );
    await inserirRelacionados(
      client,
      "motorista",
      relacionados.motoristas,
      plantaoId
    ); // Nome da propriedade: motoristas
    await inserirRelacionados(
      client,
      "movimentacaoviatura",
      relacionados.movimentacoes,
      plantaoId
    ); // Nome da propriedade: movimentacoes
    await inserirRelacionados(
      client,
      "abastecimentoviatura",
      relacionados.abastecimentos,
      plantaoId
    ); // Nome da propriedade: abastecimentos

    await client.query("COMMIT");
    return { id: plantaoId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Atualiza um plantão, permitindo alterar dados principais e/ou adicionar novas entidades relacionadas.
 * @param {number} plantaoId - O ID do plantão a ser atualizado.
 * @param {object} plantaoData - Novos dados para a tabela plantão.
 * @param {object} relacionados - Novas entidades a serem ADICIONADAS.
 */
const update = async (plantaoId, plantaoData, relacionados = {}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Atualiza os dados do plantão principal (se fornecidos)
    const { data_fim, observacoes } = plantaoData;
    if (data_fim || observacoes) {
      await client.query(
        "UPDATE plantao SET data_fim = COALESCE($1, data_fim), observacoes = COALESCE($2, observacoes) WHERE id = $3",
        [data_fim, observacoes, plantaoId]
      );
    }

    // 2. Adiciona as novas entidades relacionadas (este método não remove as antigas)
    await inserirRelacionados(
      client,
      "agentes",
      relacionados.agentes,
      plantaoId
    );
    await inserirRelacionados(
      client,
      "motorista",
      relacionados.motoristas,
      plantaoId
    );
    await inserirRelacionados(
      client,
      "movimentacaoviatura",
      relacionados.movimentacoes,
      plantaoId
    );
    await inserirRelacionados(
      client,
      "abastecimentoviatura",
      relacionados.abastecimentos,
      plantaoId
    );

    await client.query("COMMIT");

    // Retorna o plantão atualizado (opcional)
    const { rows } = await pool.query("SELECT * FROM plantao WHERE id = $1", [
      plantaoId,
    ]);
    return rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Adicione a função findAll se desejar
// ...

module.exports = {
  create,
  update,
  // findAll,
};
