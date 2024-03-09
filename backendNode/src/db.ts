import knex from 'knex';
import config from '../config/knexfile';

// Use the 'development' environment configuration
const db = knex(config.development);

// Export the Knex instance
export default db;