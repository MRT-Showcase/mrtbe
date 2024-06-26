import vine from '@vinejs/vine'

export const loginDTO = vine.compile(
  vine.object({
    phoneNumber: vine.string().trim().mobile(),
    pin: vine.string().trim().minLength(6).maxLength(6),
  })
)
