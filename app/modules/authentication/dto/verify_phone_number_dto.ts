import vine from '@vinejs/vine'

export const verifyNumberDTO = vine.compile(
  vine.object({
    phoneNumber: vine.string().trim(),
  })
)
