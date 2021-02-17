import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersHasSections extends BaseSchema {
  protected tableName = 'users_has_sections'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('section_id').unsigned().references('id').inTable('sections').onDelete('CASCADE')
      table.boolean('status')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
