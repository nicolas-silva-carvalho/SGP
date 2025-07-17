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
 * Sincroniza uma tabela relacionada (agentes, motoristas, etc.) com base nos dados do frontend.
 * @param {object} client - O cliente da transação do banco de dados.
 * @param {string} tabela - O nome da tabela (ex: 'agentes').
 * @param {string} colunaFk - O nome da coluna da chave estrangeira (ex: 'plantao_id').
 * @param {number} idFk - O valor da chave estrangeira (o ID do plantão).
 * @param {Array<object>} itensFrontend - A lista de itens vinda do frontend (deve conter 'id' para itens existentes).
 * @param {Array<string>} colunas - As colunas a serem inseridas/atualizadas (ex: ['nome', 'cargo']).
 */
const sincronizarRelacionados = async (
  client,
  tabela,
  colunaFk,
  idFk,
  itensFrontend,
  colunas
) => {
  // 1. Busca os IDs dos itens que já existem no banco de dados para este plantão
  const resDb = await client.query(
    `SELECT id FROM ${tabela} WHERE ${colunaFk} = $1`,
    [idFk]
  );
  const idsDb = new Set(resDb.rows.map((row) => row.id));

  const idsFrontend = new Set(
    itensFrontend.map((item) => item.id).filter((id) => id)
  ); // Filtra IDs nulos/undefined

  // 2. Apaga os itens que estão no DB mas não vieram do frontend
  for (const id of idsDb) {
    if (!idsFrontend.has(id)) {
      await client.query(`DELETE FROM ${tabela} WHERE id = $1`, [id]);
    }
  }

  // 3. Insere ou Atualiza os itens que vieram do frontend
  for (const item of itensFrontend) {
    if (item.id && idsDb.has(item.id)) {
      // UPDATE: O item já existe, então atualiza
      const setClauses = colunas
        .map((col, i) => `${col} = $${i + 2}`)
        .join(", ");
      const values = colunas.map((col) => item[col]);
      await client.query(`UPDATE ${tabela} SET ${setClauses} WHERE id = $1`, [
        item.id,
        ...values,
      ]);
    } else {
      // INSERT: O item é novo (não tem ID ou o ID não está no DB)
      const colunasStr = colunas.join(", ");
      const placeholders = colunas.map((_, i) => `$${i + 2}`).join(", ");
      const values = colunas.map((col) => item[col]);
      await client.query(
        `INSERT INTO ${tabela} (${colunaFk}, ${colunasStr}) VALUES ($1, ${placeholders})`,
        [idFk, ...values]
      );
    }
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

    // 1. Atualiza os dados do plantão principal
    // ADICIONADO data_inicio na desestruturação
    const { data_inicio, data_fim, observacoes, status, prioridade, local } =
      plantaoData;

    // AJUSTADO: Adicionamos data_inicio = $1 na query e reordenamos os parâmetros
    await client.query(
      "UPDATE plantao SET data_inicio = $1, data_fim = $2, observacoes = $3, status = $4, prioridade = $5, local = $6 WHERE id = $7",
      [
        data_inicio, // Parâmetro adicionado
        data_fim,
        observacoes,
        status,
        prioridade,
        local,
        plantaoId,
      ]
    );

    // 2. Sincroniza os relacionados, preservando os IDs (agentes e motoristas)
    if (relacionados.agentes) {
      await sincronizarRelacionados(
        client,
        "agentes",
        "plantao_id",
        plantaoId,
        relacionados.agentes,
        ["nome", "cargo"]
      );
    }
    if (relacionados.motoristas) {
      await sincronizarRelacionados(
        client,
        "motorista",
        "plantao_id",
        plantaoId,
        relacionados.motoristas,
        ["nome"]
      );
    }

    // 3. Apaga e reinserir movimentações e abastecimentos
    await client.query(
      "DELETE FROM abastecimentoviatura WHERE movimentacao_id IN (SELECT id FROM movimentacaoviatura WHERE plantao_id = $1)",
      [plantaoId]
    );
    await client.query(
      "DELETE FROM movimentacaoviatura WHERE plantao_id = $1",
      [plantaoId]
    );

    if (relacionados.movimentacoes && relacionados.movimentacoes.length > 0) {
      for (const mov of relacionados.movimentacoes) {
        const movResult = await client.query(
          `INSERT INTO movimentacaoviatura (plantao_id, placa, kminicial, kmfinal) VALUES ($1, $2, $3, $4) RETURNING id`,
          [plantaoId, mov.placa, mov.kminicial, mov.kmfinal]
        );
        const movimentacaoId = movResult.rows[0].id;

        if (mov.abastecimentos && mov.abastecimentos.length > 0) {
          for (const abast of mov.abastecimentos) {
            await client.query(
              `INSERT INTO abastecimentoviatura (movimentacao_id, kilometroabastecimento, valor) VALUES ($1, $2, $3)`,
              [movimentacaoId, abast.kilometroabastecimento, abast.valor]
            );
          }
        }
      }
    }

    await client.query("COMMIT");

    const plantaoAtualizado = await findById(plantaoId);
    return plantaoAtualizado;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao sincronizar o plantão no banco de dados:", error);
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
