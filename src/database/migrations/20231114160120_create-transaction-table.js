/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable("transactions", (table) => {
            table.increments('id').primary();
            table.integer('walletId').unsigned().references('id').inTable('wallets').onDelete('CASCADE');
            table.decimal('amount', 12, 2).defaultTo(0.00);
            table.decimal('previousBalance', 12, 2).defaultTo(0.00);
            table.decimal('currentBalance', 12, 2).defaultTo(0.00);
            table.string("transactionType");
            table.string("description");
            table.timestamps(true, true);
        })
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("transactions")
};
