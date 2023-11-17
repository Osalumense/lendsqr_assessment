/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable("bankDetails", (table) => {
            table.increments('id').primary();
            table.string("type").defaultTo('NUBAN');
            table.string("name").notNullable();
            table.string("accountNumber").notNullable();
            table.string("bankName").notNullable();
            table.string("bankCode").notNullable();
            table.string("currency").defaultTo("NGN").notNullable();
            table.string("recipientCode").notNullable();
            table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
            table.timestamps(true, true);
        })
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("bankDetails")
};
