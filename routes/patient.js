const router = require('express').Router()
const { patientController } = require('../controllers/patient')
const auth = require('../middlewares/auth')

router.post('/add_patient', patientController.addPatient)

module.exports = router