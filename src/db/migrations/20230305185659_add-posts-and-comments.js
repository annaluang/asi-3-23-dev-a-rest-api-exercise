export const up = async (knex) => {
  await knex.schema.createTable("posts", (table) => {
    table.increments("id")
    table.text("title").notNullable()
    table.text("content").notNullable()
    table.timestamps(true, true, true)
    table.integer("userId").notNullable().references("id").inTable("users")
    table
      .integer("categories")
      .notNullable()
      .references("id")
      .inTable("categories")
      .onUpdate("CASCADE")
      .onDelete("CASCADE")
  })
  await knex.schema.createTable("comments", (table) => {
    table.increments("id")
    table.text("content")
    table.timestamps(true, true, true)
    table
      .integer("userId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("")
    table.integer("postId").notNullable().references("id").inTable("posts")
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("comments")
  await knex.schema.dropTable("posts")
}
