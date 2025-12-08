/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('subcategories', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.string('name', 255).notNullable();
        table.integer('file_id').unsigned().notNullable();
        table.integer('category_id').unsigned().notNullable();
        table.boolean('status').notNullable().defaultTo(false);
        table.text('description').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.timestamp('deleted_at').nullable();

        // Indexes for better performance
        table.index('id');
        table.index('user_id');
        table.index('file_id');
        table.index('category_id');
        table.index('deleted_at');
        table.foreign('file_id').references('id').inTable('files').onDelete('CASCADE');
        table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE');
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('subcategories');
};
