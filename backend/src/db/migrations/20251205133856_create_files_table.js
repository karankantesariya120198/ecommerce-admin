/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('files', function(table) {
        table.increments('id').primary();
        table.string('folder_name', 255).notNullable();
        table.string('file_name', 255).notNullable();
        table.string('format', 255).notNullable();
        table.integer('sizeKB').notNullable();
        table.string('type', 255).notNullable();
        table.string('module', 255).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.timestamp('deleted_at').nullable();

        // Indexes for better performance
        table.index('id');
        table.index('file_name');
        table.index('format');
        table.index('deleted_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('files');
};
