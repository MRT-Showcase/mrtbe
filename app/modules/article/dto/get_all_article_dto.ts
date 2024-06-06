import vine from '@vinejs/vine'

export const getAllArticleDto = vine.compile(
  vine.object({
    params: vine.object({
      page: vine.number().optional(),
      perPage: vine.number().optional(),
      searchTerm: vine.string().optional(),
    }),
  })
)
