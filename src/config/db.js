require('dotenv').config();

const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'events',
});

let connectionPromise;

async function connectDatabase() {
  if (!connectionPromise) {
    connectionPromise = client.connect()
      .then(async () => {
        const result = await client.query('SELECT NOW()');
        console.log('PostgreSQL connected:', result.rows[0]);
      })
      .catch((error) => {
        connectionPromise = undefined;
        console.error('Error connecting to PostgreSQL:', error);
        throw error;
      });
  }

  return connectionPromise;
}

async function query(text, params) {
  return client.query(text, params);
}

module.exports = {
  client,
  connectDatabase,
  query,
};