/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('subcategories', function(table) {
        table.string('slug', 255).notNullable().after('name');
        table.boolean('featured').notNullable().defaultTo(false).after('status');
        table.jsonb('specifications').nullable().after('description');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('subcategories', function(table) {
        table.dropColumn('slug');
        table.dropColumn('featured');
        table.dropColumn('specifications');
    });
};
