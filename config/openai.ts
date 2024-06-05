import OpenAI from 'openai'
import env from '#start/env'

const openai = new OpenAI({
  apiKey: env.get('OPENAI_API_KEY'),
})

export default openai
