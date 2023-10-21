const router = require('express').Router()
const { patientController } = require('../controllers/patient')
const auth = require('../middlewares/auth')

router.post('/add_patient', patientController.addPatient)
router.get('/all_patients', patientController.getAllPatients)
router.get('/patient/:fhirId', patientController.getPatients)
router.put('/update_patient/:fhirId', patientController.updatePatient)
router.delete('/del_patient/:fhirId', patientController.deletepatient)

module.exports = router