const router = require('express').Router()
const { userController } = require('../controllers/user')
 const auth = require('../middlewares/auth')

router.post('/signup', userController.userSignup)
router.post('/verify_registration', userController.verifyAndRegisteration)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.post('/forgot_password', userController.forgotPassword)
router.post('/reset_password', auth ,userController.resetPassword)
router.get('/user_info', auth, userController.getUser)
router.put('/update_user', auth, userController.updateUser)
router.delete('/delete_user', auth, userController.deleteUser)


module.exports = router