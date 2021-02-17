import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Sections extends BaseSchema {
  protected tableName = 'sections'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable().unique()
      table.string('title')
      table.integer('playlist_id').unsigned().references('id').inTable('playlists').onDelete('CASCADE')
      table.integer('serial_number')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
