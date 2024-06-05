import vine from '@vinejs/vine'

export const loginGoogleDto = vine.compile(
  vine.object({
    firebaseId: vine.string().trim(),
  })
)
