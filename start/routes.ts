import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { cuid } from '@adonisjs/core/helpers'

const UserController = () => import('#authentication/authentication_controller')
const WordController = () => import('#word/word_controller')

/*
User Routes
 */
router.get('auth/user', [UserController, 'getUser']).use(
  middleware.auth({
    guards: ['api'],
  })
)
router.post('auth/register', [UserController, 'register'])
router.post('auth/login/pin', [UserController, 'login'])
router.post('auth/validate', [UserController, 'validatePhoneNumber'])
router.get('auth/login/google', [UserController, 'loginByGoogle'])
router.get('auth/create-pin', [UserController, 'createPin']).use(
  middleware.auth({
    guards: ['api'],
  })
)
/*
End of user routes
 */

router.get('/cuid', async () => {
  return cuid()
})

/*
Start of Synonym routes
 */

router.post('/synonyms', [WordController, 'getSynonyms'])

/*
End of Synonym routes
 */
