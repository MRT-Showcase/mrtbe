import vine from '@vinejs/vine'

export const getSynonymsDto = vine.compile(
  vine.object({
    word: vine.string().trim(),
  })
)
