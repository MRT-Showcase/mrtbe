import vine from '@vinejs/vine'

export const registerDTO = vine.compile(
  vine.object({
    phoneNumber: vine.string().trim().mobile(),
    pin: vine.string().trim().minLength(6).maxLength(6),
    fullName: vine.string().trim(),
    email: vine.string().trim().email(),
  })
)
