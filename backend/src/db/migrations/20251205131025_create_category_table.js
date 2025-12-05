/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('categories', function(table) {
        table.increments('id').primary();
        table.bigInteger('userId').notNullable();
        table.string('name', 255).notNullable();
        table.string('slug', 255).notNullable();
        table.text('description').notNullable();
        table.string('fileId', 255).notNullable();
        table.boolean('status').notNullable().defaultTo(false);
        table.boolean('featured').notNullable().defaultTo(false);
        table.integer('parentId').nullable();
        table.jsonb('specifications').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.timestamp('deleted_at').nullable();

        // Indexes for better performance
        table.index('id');
        table.index('userId');
        table.index('slug');
        table.index('deleted_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('categories');
};
