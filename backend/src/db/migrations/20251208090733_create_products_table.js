/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('products', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.string('name', 255).notNullable();
        table.string('sku', 255).notNullable();
        table.float('price').notNullable();
        table.float('discounted_price').nullable();
        table.integer('category_id').unsigned().nullable();
        table.integer('subcategory_id').unsigned().nullable();
        table.integer('stock').notNullable();
        table.string('status').notNullable();
        table.text('description').notNullable();
        table.jsonb('specifications').nullable();
        table.boolean('featured').notNullable().defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.timestamp('deleted_at').nullable();

        // Indexes for better performance
        table.index('id');
        table.index('user_id');
        table.index('name');
        table.index('category_id');
        table.index('subcategory_id');
        table.index('deleted_at');
        table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE');
        table.foreign('subcategory_id').references('id').inTable('subcategories').onDelete('CASCADE');
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('products');
};
