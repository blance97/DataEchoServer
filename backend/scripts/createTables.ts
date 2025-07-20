import knex from "knex";
import config from "../config/knexfile";
import logger from "../src/loggers";

const db = knex(config.development);

db.raw('PRAGMA foreign_keys = ON;')
    .then(() => console.log('Foreign key enforcement is enabled.'))
    .catch(err => console.error('Failed to enable foreign key enforcement:', err));

const initializeDatabase = async () => {

    const groups_tableExists = await db.schema.hasTable('groups');

    if (!groups_tableExists) {
        await db.schema.createTable('groups', (table) => {
            table.increments('id').primary();
            table.string('name').unique();
            table.string('description');
        });
    }

    const api_details_tableExists = await db.schema.hasTable('api_details');

    if (!api_details_tableExists) {
        await db.schema.createTable('api_details', (table) => {
            table.increments('id').primary();
            table.integer('group_id').unsigned();
            table.string('api_name');
            table.string('api_method');
            table.text('api_response_body');
            table.text('api_response_body_type')
            table.integer('api_response_code');
            table.unique(['api_name', 'api_method', 'api_response_code']);
            table.foreign('group_id').references('groups.id').onDelete('CASCADE');
        });
    }

    const responseHeaders_tableExists = await db.schema.hasTable('response_headers');
    if (!responseHeaders_tableExists) {
        await db.schema.createTable('response_headers', (table) => {
            table.increments('id').primary();
            table.string('header_name');
            table.string('header_value');
            table.integer('api_id').unsigned();
            table.foreign('api_id').references('api_details.id').onDelete('CASCADE');
        });
    }

    logger.info('Database initialized successfully');
    await db.destroy();
};

export default initializeDatabase;
