const { pool } = require("../config/db");

/**
 * Função auxiliar para inserir entidades relacionadas que estão diretamente ligadas ao plantão.
 * @param {object} client - O cliente de conexão do banco de dados.
 * @param {string} tabela - O nome da tabela (ex: "agentes", "motorista").
 * @param {array} itens - O array de itens a serem inseridos.
 * @param {number} plantaoId - O ID do plantão pai.
 */
const inserirRelacionadosDiretos = async (client, tabela, itens, plantaoId) => {
  if (!itens || itens.length === 0) {
    return; // Se não houver itens, não faz nada.
  }

  const camposMap = {
    agentes: ["nome", "cargo"],
    motorista: ["nome"],
  };

  const campos = camposMap[tabela];
  if (!campos) {
    throw new Error(`Tabela relacionada direta desconhecida: ${tabela}`);
  }

  const placeholders = campos.map((_, index) => `$${index + 1}`).join(", ");
  const query = `INSERT INTO ${tabela} (${campos.join(
    ", "
  )}, plantao_id) VALUES (${placeholders}, $${campos.length + 1})`;

  for (const item of itens) {
    const valores = campos.map((campo) => item[campo]);
    await client.query(query, [...valores, plantaoId]);
  }
};

/**
 * Cria um novo plantão e todas as suas entidades relacionadas.
 * @param {object} plantaoData - Dados principais do plantão.
 * @param {object} relacionados - Objeto contendo arrays para cada entidade.
 */
const create = async (plantaoData, relacionados = {}) => {
  const { data_inicio, data_fim, observacoes, status, prioridade, local } =
    plantaoData;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Insere o plantão principal com as novas colunas
    // Usamos '??' (nullish coalescing operator) para garantir que 'undefined' ou 'null'
    // usem o valor padrão, mas strings vazias (que são válidas) sejam preservadas.
    // Para 'local', enviamos diretamente, pois uma string vazia é um valor válido.
    const plantaoQuery = `INSERT INTO plantao (data_inicio, data_fim, observacoes, status, prioridade, local) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`;
    const resultPlantao = await client.query(plantaoQuery, [
      data_inicio,
      data_fim,
      observacoes,
      status ?? "pendente", // Usar ?? para permitir string vazia
      prioridade ?? "media", // Usar ?? para permitir string vazia
      local, // Enviar diretamente para permitir string vazia
    ]);
    const plantaoId = resultPlantao.rows[0].id;

    // 2. Insere entidades relacionadas diretas (agentes, motoristas)
    await inserirRelacionadosDiretos(
      client,
      "agentes",
      relacionados.agentes,
      plantaoId
    );
    await inserirRelacionadosDiretos(
      client,
      "motorista",
      relacionados.motoristas,
      plantaoId
    );

    // 3. Insere movimentações e seus abastecimentos
    if (relacionados.movimentacoes && relacionados.movimentacoes.length > 0) {
      for (const mov of relacionados.movimentacoes) {
        const movQuery = `INSERT INTO movimentacaoviatura (plantao_id, placa, kminicial, kmfinal) VALUES ($1, $2, $3, $4) RETURNING id;`;
        const movResult = await client.query(movQuery, [
          plantaoId,
          mov.placa,
          mov.kminicial,
          mov.kmfinal,
        ]);
        const movimentacaoId = movResult.rows[0].id;

        // Insere abastecimentos para esta movimentação
        if (mov.abastecimentos && mov.abastecimentos.length > 0) {
          const abastQuery = `INSERT INTO abastecimentoviatura (movimentacao_id, kilometroabastecimento, valor) VALUES ($1, $2, $3);`;
          for (const abast of mov.abastecimentos) {
            await client.query(abastQuery, [
              movimentacaoId,
              abast.kilometroabastecimento,
              abast.valor,
            ]);
          }
        }
      }
    }

    await client.query("COMMIT");
    // Retorna o plantão recém-criado com suas relações para o frontend
    const novoPlantaoCompleto = await findById(plantaoId);
    return novoPlantaoCompleto;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Atualiza um plantão, permitindo alterar dados principais e/ou adicionar novas entidades relacionadas.
 * Este método adiciona novas entidades, mas não edita ou remove as existentes por ID.
 * Para edição/remoção, seriam necessárias funções específicas (ex: updateAgent, deleteAgent).
 * @param {number} plantaoId - O ID do plantão a ser atualizado.
 * @param {object} plantaoData - Novos dados para a tabela plantão.
 * @param {object} relacionados - Novas entidades a serem ADICIONADAS.
 */
const update = async (plantaoId, plantaoData, relacionados = {}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Atualiza os dados do plantão principal (se fornecidos)
    const { data_fim, observacoes, status, prioridade, local } = plantaoData;
    // Usamos COALESCE para data_fim e observacoes, pois eles podem ser nulos.
    // Para status, prioridade e local, se o valor for explicitamente passado (mesmo que vazio),
    // queremos usá-lo, não o valor antigo do DB.
    // Se o valor for 'undefined' (não enviado), COALESCE ainda funcionará.
    await client.query(
      "UPDATE plantao SET data_fim = COALESCE($1, data_fim), observacoes = COALESCE($2, observacoes), status = $3, prioridade = $4, local = $5 WHERE id = $6",
      [
        data_fim,
        observacoes,
        status ?? null, // Usar ?? null para permitir string vazia ou definir como null se undefined
        prioridade ?? null, // Usar ?? null para permitir string vazia ou definir como null se undefined
        local ?? null, // Usar ?? null para permitir string vazia ou definir como null se undefined
        plantaoId,
      ]
    );

    // 2. Adiciona as novas entidades relacionadas diretas (agentes, motoristas)
    await inserirRelacionadosDiretos(
      client,
      "agentes",
      relacionados.agentes,
      plantaoId
    );
    await inserirRelacionadosDiretos(
      client,
      "motorista",
      relacionados.motoristas,
      plantaoId
    );

    // 3. Adiciona novas movimentações e seus abastecimentos
    if (relacionados.movimentacoes && relacionados.movimentacoes.length > 0) {
      for (const mov of relacionados.movimentacoes) {
        const movQuery = `INSERT INTO movimentacaoviatura (plantao_id, placa, kminicial, kmfinal) VALUES ($1, $2, $3, $4) RETURNING id;`;
        const movResult = await client.query(movQuery, [
          plantaoId,
          mov.placa,
          mov.kminicial,
          mov.kmfinal,
        ]);
        const movimentacaoId = movResult.rows[0].id;

        if (mov.abastecimentos && mov.abastecimentos.length > 0) {
          const abastQuery = `INSERT INTO abastecimentoviatura (movimentacao_id, kilometroabastecimento, valor) VALUES ($1, $2, $3);`;
          for (const abast of mov.abastecimentos) {
            await client.query(abastQuery, [
              movimentacaoId,
              abast.kilometroabastecimento,
              abast.valor,
            ]);
          }
        }
      }
    }

    await client.query("COMMIT");

    // Retorna o plantão atualizado completo
    const plantaoAtualizado = await findById(plantaoId);
    return plantaoAtualizado;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Busca todos os plantões com suas entidades relacionadas aninhadas.
 * Assume que abastecimentoviatura está ligado a movimentacaoviatura.
 */
const findAll = async () => {
  const client = await pool.connect();
  try {
    const query = `
            SELECT
                p.id,
                p.data_inicio,
                p.data_fim,
                p.observacoes,
                p.status,
                p.prioridade,
                p.local,
                COALESCE(
                    json_agg(DISTINCT jsonb_build_object('id', a.id, 'nome', a.nome, 'cargo', a.cargo))
                    FILTER (WHERE a.id IS NOT NULL),
                    '[]'
                ) AS agentes,
                COALESCE(
                    json_agg(DISTINCT jsonb_build_object('id', m.id, 'nome', m.nome))
                    FILTER (WHERE m.id IS NOT NULL),
                    '[]'
                ) AS motoristas,
                COALESCE(
                    json_agg(DISTINCT jsonb_build_object(
                        'id', mv.id,
                        'placa', mv.placa,
                        'kminicial', mv.kminicial,
                        'kmfinal', mv.kmfinal,
                        'abastecimentos', (
                            SELECT
                                COALESCE(json_agg(jsonb_build_object(
                                    'id', ab.id,
                                    'kilometroabastecimento', ab.kilometroabastecimento,
                                    'valor', ab.valor
                                )) FILTER (WHERE ab.id IS NOT NULL), '[]')
                            FROM abastecimentoviatura ab
                            WHERE ab.movimentacao_id = mv.id
                        )
                    )) FILTER (WHERE mv.id IS NOT NULL),
                    '[]'
                ) AS movimentacoes
            FROM
                plantao p
            LEFT JOIN
                agentes a ON p.id = a.plantao_id
            LEFT JOIN
                motorista m ON p.id = m.plantao_id
            LEFT JOIN
                movimentacaoviatura mv ON p.id = mv.plantao_id
            GROUP BY
                p.id
            ORDER BY
                p.data_inicio DESC;
        `;
    const { rows } = await client.query(query);
    return rows;
  } catch (error) {
    console.error("Erro ao buscar todos os plantões:", error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Busca um plantão por ID com suas entidades relacionadas aninhadas.
 * @param {number} id - O ID do plantão.
 */
const findById = async (id) => {
  const client = await pool.connect();
  try {
    const query = `
            SELECT
                p.id,
                p.data_inicio,
                p.data_fim,
                p.observacoes,
                p.status,
                p.prioridade,
                p.local,
                COALESCE(
                    json_agg(DISTINCT jsonb_build_object('id', a.id, 'nome', a.nome, 'cargo', a.cargo))
                    FILTER (WHERE a.id IS NOT NULL),
                    '[]'
                ) AS agentes,
                COALESCE(
                    json_agg(DISTINCT jsonb_build_object('id', m.id, 'nome', m.nome))
                    FILTER (WHERE m.id IS NOT NULL),
                    '[]'
                ) AS motoristas,
                COALESCE(
                    json_agg(DISTINCT jsonb_build_object(
                        'id', mv.id,
                        'placa', mv.placa,
                        'kminicial', mv.kminicial,
                        'kmfinal', mv.kmfinal,
                        'abastecimentos', (
                            SELECT
                                COALESCE(json_agg(jsonb_build_object(
                                    'id', ab.id,
                                    'kilometroabastecimento', ab.kilometroabastecimento,
                                    'valor', ab.valor
                                )) FILTER (WHERE ab.id IS NOT NULL), '[]')
                            FROM abastecimentoviatura ab
                            WHERE ab.movimentacao_id = mv.id
                        )
                    )) FILTER (WHERE mv.id IS NOT NULL),
                    '[]'
                ) AS movimentacoes
            FROM
                plantao p
            LEFT JOIN
                agentes a ON p.id = a.plantao_id
            LEFT JOIN
                motorista m ON p.id = m.plantao_id
            LEFT JOIN
                movimentacaoviatura mv ON p.id = mv.plantao_id
            WHERE
                p.id = $1
            GROUP BY
                p.id;
        `;
    const { rows } = await client.query(query, [id]);
    return rows[0]; // Retorna a primeira linha ou undefined se não encontrado
  } catch (error) {
    console.error(`Erro ao buscar plantão com ID ${id}:`, error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  create,
  update,
  findAll,
  findById,
};
