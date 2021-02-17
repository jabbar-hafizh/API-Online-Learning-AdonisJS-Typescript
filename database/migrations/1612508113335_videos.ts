import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Videos extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable().unique()
      table.string('title')
      table.text('description')
      table.string('link')
      table.integer('section_id').unsigned().references('id').inTable('sections').onDelete('CASCADE')
      table.integer('serial_number')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
