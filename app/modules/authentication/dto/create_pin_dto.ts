import vine from '@vinejs/vine'

export const createPinDto = vine.compile(
  vine.object({
    pin: vine.string().minLength(6).maxLength(6),
  })
)
