export const up = async (knex) => {
  await knex.schema.createTable("categories", (table) => {
    table.increments("id")
    table.text("nameCategorie").notNullable()
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("categories")
}
