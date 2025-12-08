/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.string('email', 255).notNullable().unique();
        table.string('password', 255).notNullable();
        table.string('iv', 255).notNullable();
        table.string('nickname', 255).notNullable();
        table.string('phone', 20).notNullable();
        table.text('intro').notNullable();
        table.enu('gender', ['male', 'female', 'other']).notNullable().defaultTo('other');
        table.boolean('agreement').notNullable().defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.timestamp('deleted_at').nullable();

        // Indexes for better performance
        table.index('id');
        table.index('email');
        table.index('nickname');
        table.index('deleted_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};
