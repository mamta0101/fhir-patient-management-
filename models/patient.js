const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    fhirResponse: { type: Object },
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
