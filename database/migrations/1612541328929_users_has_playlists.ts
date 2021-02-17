import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersHasPlaylists extends BaseSchema {
  protected tableName = 'users_has_playlists'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('playlist_id').unsigned().references('id').inTable('playlists').onDelete('CASCADE')
      table.boolean('status')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
