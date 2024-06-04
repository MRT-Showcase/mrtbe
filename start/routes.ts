import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UserController = () => import('#authentication/authentication_controller')

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
