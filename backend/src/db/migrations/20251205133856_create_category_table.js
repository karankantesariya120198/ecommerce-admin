/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('categories', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.string('name', 255).notNullable();
        table.string('slug', 255).notNullable();
        table.text('description').notNullable();
        table.integer('file_id').unsigned().notNullable();
        table.boolean('status').notNullable().defaultTo(false);
        table.boolean('featured').notNullable().defaultTo(false);
        table.integer('parent_id').nullable();
        table.jsonb('specifications').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.timestamp('deleted_at').nullable();

        // Indexes for better performance
        table.index('id');
        table.index('user_id');
        table.index('name');
        table.index('slug');
        table.index('deleted_at');
        table.foreign('file_id').references('id').inTable('files').onDelete('CASCADE');
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('categories');
};
