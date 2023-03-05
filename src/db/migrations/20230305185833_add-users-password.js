export const up = async (knex) => {
  await knex.schema.alterTable("users", (table) => {
    table.text("passwordHash")
    table.text("passwordSalt")
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumns("passwordHash", "passwordSalt")
  })
}
