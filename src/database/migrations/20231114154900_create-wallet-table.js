/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable("wallets", (table) => {
            table.increments('id').primary();
            table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
            table.decimal('balance', 12, 2).defaultTo(0.00);
            table.timestamps(true, true);
        })
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("wallets")
};
