/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('product_files', function(table) {
        table.increments('id').primary();
        table.integer('product_id').unsigned().notNullable();
        table.integer('file_id').unsigned().notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.timestamp('deleted_at').nullable();

        // Indexes for better performance
        table.index('id');
        table.index('product_id');
        table.index('file_id');
        table.index('deleted_at');
        table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
        table.foreign('file_id').references('id').inTable('files').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('product_files');
};
