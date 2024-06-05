import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { type ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Word extends BaseModel {
  @column({ isPrimary: true })
  declare id: String

  @column()
  declare word: String

  @manyToMany(() => Word, {
    pivotTable: 'synonyms',
    localKey: 'id',
    pivotForeignKey: 'word_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'synonym_id',
  })
  declare synonyms: ManyToMany<typeof Word>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
