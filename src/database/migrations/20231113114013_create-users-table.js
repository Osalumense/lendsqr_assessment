const { table } = require("console");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable("users", (table) => {
            table.increments('id').primary();
            table.string('uuid').defaultTo(knex.raw('uuid()')).unique();
            table.string("firstName").notNullable();
            table.string("lastName").notNullable();
            table.string("phone");
            table.string("email").notNullable();
            table.string("password").notNullable();
            table.timestamps(true, true);
        })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("users")
};
