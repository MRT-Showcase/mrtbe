import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'synonyms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('word_id').index().references('id').inTable('words')
      table.string('synonym_id').index().references('id').inTable('words')

      table.primary(['word_id', 'synonym_id'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
