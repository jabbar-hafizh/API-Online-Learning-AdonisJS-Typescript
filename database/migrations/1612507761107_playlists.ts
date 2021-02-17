import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Playlists extends BaseSchema {
  protected tableName = 'playlists'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable().unique()
      table.string('title')
      table.text('description')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
