import Word from '#models/word'
import openai from '#config/openai'
import { cuid } from '@adonisjs/core/helpers'
import db from '@adonisjs/lucid/services/db'

export default class WordService {
  async getSynonyms({ word }: { word: string }) {
    let source = 'db'
    let queryWord = await Word.query().preload('synonyms').where('word', word).first()

    if (!queryWord) {
      source = 'generated'
      let response = await this.openApiRequest({ word })
      try {
        let responseString = response.choices[0].message.content
        if (!responseString) {
          throw new Error('No response from OpenAI')
        }
        let responseObject = JSON.parse(responseString)
        let synonymsResponse = responseObject.synonyms.filter((synonym: string) => synonym !== word)

        let newWord = new Word()
        newWord.id = cuid()
        newWord.word = word
        let wordEntry = await newWord.save()

        let existingSynonyms = await Word.query().whereIn('word', synonymsResponse)
        let existingSynonymsWords = existingSynonyms.map((synonym) => synonym.word)

        let newSynonyms = synonymsResponse
          .filter((synonym: string) => !existingSynonymsWords.includes(synonym))
          .map((synonym: string) => ({
            id: cuid(),
            word: synonym,
          }))
        if (newSynonyms.length > 0) {
          await Word.createMany(newSynonyms)
        }

        const allSynonyms = [...existingSynonyms, ...newSynonyms]

        const relationships = allSynonyms.map((syn) => ({
          word_id: wordEntry.id,
          synonym_id: syn.id,
        }))

        const reverseRelationships = allSynonyms.map((syn) => ({
          word_id: syn.id,
          synonym_id: wordEntry.id,
        }))

        const synonymRelationships = []

        for (let i = 0; i < allSynonyms.length; i++) {
          for (let j = 0; j < allSynonyms.length; j++) {
            if (i !== j) {
              synonymRelationships.push({
                word_id: allSynonyms[i].id,
                synonym_id: allSynonyms[j].id,
              })
            }
          }
        }

        let allRelationships = [...relationships, ...reverseRelationships, ...synonymRelationships]

        await db.table('synonyms').insert(allRelationships)

        let returnedWord = await Word.query().preload('synonyms').where('word', word).first()
        if (returnedWord) {
          return { source, word: returnedWord }
        } else {
          throw new Error('Error fetching synonyms')
        }
      } catch (e) {
        throw new Error('Error fetching synonyms')
      }
    }
    return { source, words: queryWord }
  }

  private async openApiRequest({ word }: { word: string }) {
    return openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content:
            'you are a Al that provide synonyms for word in Bahasa Indonesia. You will get word parameter and return\n' +
            'the array of words synonym. The given synonym is the understandable and commonly use by person that\n' +
            'live in Indonesia. You response muse be formatted like this json {"synonyms": arrays of synonyms}',
        },
        {
          role: 'user',
          content: word,
        },
      ],
      temperature: 1,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
  }
}
