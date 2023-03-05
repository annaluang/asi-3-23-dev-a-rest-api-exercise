export const up = async (knex) => {
  await knex.schema.createTable("roles", (table) => {
    table.increments("id")
    table.text("permission").notNullable()
    table.integer("role").notNullable()
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("roles")
}
