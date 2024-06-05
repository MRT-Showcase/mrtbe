import { inject } from '@adonisjs/core'
import WordService from './word_service.js'
import { HttpContext } from '@adonisjs/core/http'
import { getSynonymsDto } from './dto/get_synonyms_dto.js'
import DefaultResponseBuilder from '#utils/default_response_builder'

@inject()
export default class WordController {
  constructor(protected readonly wordService: WordService) {}

  async getSynonyms({ request }: HttpContext) {
    let payload = await request.validateUsing(getSynonymsDto)
    let synonyms = await this.wordService.getSynonyms({
      word: payload.word,
    })

    return new DefaultResponseBuilder<typeof synonyms>()
      .setStatusCode(200)
      .setSuccess(true)
      .setData(synonyms)
      .setMessage('Success get synonims')
      .build()
  }
}
