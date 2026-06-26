const bcrypt = require('bcryptjs');

const { query } = require('../config/db');
const { toSafeUser } = require('../models/user.model');

const SALT_ROUNDS = 12;

async function findByEmail(email) {
  const queryText = 'SELECT id, name, email FROM users WHERE email = $1 LIMIT 1';
  const result = await query(queryText, [email]);

  return toSafeUser(result.rows[0]);
}

async function findByCredentials(email, password) {
  const queryText = 'SELECT id, name, email, password FROM users WHERE email = $1 LIMIT 1';
  const result = await query(queryText, [email]);
  const row = result.rows[0];

  if (!row) {
    return null;
  }

  const match = await bcrypt.compare(password, row.password);

  return match ? toSafeUser(row) : null;
}

async function createUser({ name, email, password }) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const queryText = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email
  `;
  const result = await query(queryText, [name, email, hash]);

  return toSafeUser(result.rows[0]);
}

async function getAllUsers() {
  const result = await query('SELECT id, name, email FROM users ORDER BY id ASC');
  return result.rows.map(toSafeUser);
}

async function getAllEvents() {
  const result = await query('SELECT * FROM events');
  return result.rows;
}

module.exports = {
  createUser,
  findByEmail,
  findByCredentials,
  getAllEvents,
  getAllUsers,
};