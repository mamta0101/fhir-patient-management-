const Patient = require('../models/patient')
const axios = require('axios');

const fhirBaseUrl = 'http://localhost:8080/fhir/';

const patientController = {
  addPatient: async (req, res) => {
    try {
      const patientData = req.body;
      const dateOfBirth = new Date(patientData.birthDate);
      if (isNaN(dateOfBirth)) {
        return res.status(400).json({ message: 'Invalid dateOfBirth format' });
      }
      const response = await axios.post(`${fhirBaseUrl}/Patient`, patientData);
      res.status(201).json(response.data);
      //<--------------------------------save fhir adhere patient data intomongodb Data ------------------------------------------>
      const patient = new Patient({
        firstName: patientData.name[0].given[0],
        lastName: patientData.name[0].family,
        dateOfBirth: dateOfBirth,
        gender: patientData.gender,
        fhirResponse: patientData,
        createdBy: req.user
      });

      await patient.save();

      // res.status(201).json({
      //   message: 'Patient created successfully',
      //   patient: patient,
      // });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Fetch all FHIR-compliant patient records 
  getAllPatients: async (req, res) => {
    try {

      const response = await axios.get(`${fhirBaseUrl}/Patient`);
      //<--------------------------------incase of manepulating the mongodb Data -------------------------------------------------->
      const patients = await Patient.find()
      res.status(200).json(patients)

     // res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve patient records' });
    }
  },

  //fetch patient detail by id
  getPatients: async (req, res) => {
    try {
      const  fhirId  = req.params.fhirId;
     // const response = await axios.get(`${fhirBaseUrl}/Patient/${fhirId}`);

      //<--------------------------------incase of manepulating the mongodb Data -------------------------------------------------->
       const patient = await Patient.findById(fhirId)
        if (!patient) {
        return res.status(404).json({ message: 'Patient data not found' });
      }
        res.status(200).json(patient);
      // res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve the patient record' });
    }
  },

  // Update a patient record by ID
  updatePatient: async (req, res) => {
    try {
      const  fhirId  = req.params.fhirId;
      const updatedPatientData = req.body;
     // const response = await axios.put(`${fhirBaseUrl}/Patient/${fhirId}`, updatedPatientData);
       // res.status(200).json(response.data);
      //<--------------------------------incase of manepulating the mongodb Data -------------------------------------------------->
       const patient = await Patient.findById(fhirId)
        if (!patient) {
        return res.status(404).json({ message: 'Patient data not found' });
      }
        if (patient.createdBy != req.user) {
          return res.status(403).send({
              status: false,
              message: 'You are not authorized to update this patient data',
              data: {}
          });
      }
        const updatedPatient = await Patient.findByIdAndUpdate(
          fhirId,
          req.body,
          { new: true }
      );
       res.status(200).json(updatedPatient);
   
    } catch (error) {
      res.status(500).json({ error: 'Failed to update the patient record' });
    }
  },

  // Delete a patient record  by ID
  deletepatient: async (req, res) => {
    try {
      const  fhirId  = req.params.fhirId;
      // const response = await axios.delete(`${fhirBaseUrl}/Patient/${fhirId}`);
      // if (response) {
      //   res.status(200).json({ message: 'Patient record deleted successfully' });
      // } else {
      //   res.status(404).json({ error: 'Patient record not found' });
      // }
      //<--------------------------------incase of manepulating the mongodb Data -------------------------------------------------->
       const patient = await Patient.findById(fhirId)
        if (!patient) {
        return res.status(404).json({ message: 'Patient data not found' });
      }
        if (patient.createdBy != req.user) {
          return res.status(403).send({
              status: false,
              message: 'You are not authorized to delete this patient data',
              data: {}
          });
      }
      await Patient.findByIdAndDelete(fhirId);

    } catch (error) {
      res.status(500).json({ error: 'Failed to delete the patient record' });
    }
  }

};




module.exports = { patientController }


