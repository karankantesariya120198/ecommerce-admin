// Root-level Knex config for CLI usage
require('dotenv').config();

const path = require('path');

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'dev_db',
      charset: process.env.DB_CHARSET || 'utf8mb4'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, 'src/db/migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'src/db/seeds')
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'dev_db',
      charset: process.env.DB_CHARSET || 'utf8mb4'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, 'src/db/migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'src/db/seeds')
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
