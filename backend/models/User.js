const { pool } = require("../config/db");

const findOneByEmail = async (email) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return rows[0];
};

const findById = async (id) => {
  const { rows } = await pool.query(
    "SELECT id, name, email FROM users WHERE id = $1",
    [id]
  );
  return rows[0];
};

const create = async ({ name, email, password }) => {
  const { rows } = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, password]
  );
  return rows[0];
};

const update = async (id, fields) => {
  const { name, password } = fields;

  const { rows } = await pool.query(
    `UPDATE users SET
      name = COALESCE($1, name),
      password = COALESCE($2, password)
    WHERE id = $3
    RETURNING *`,
    [name, password, id]
  );
  return rows[0];
};

module.exports = {
  findOneByEmail,
  findById,
  create,
  update,
};
