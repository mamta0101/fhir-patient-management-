const express = require('express');
const Patient = require('../models/patient')
const axios = require('axios');

// CRUD operations for FHIR Patient Records
const fhirBaseUrl = 'http://localhost:8080/fhir/';

const patientController = {

  addPatient: async (req, res) => {
    try {

      const patientData = req.body;
      const dateOfBirth = new Date(patientData.birthDate);
      if (isNaN(dateOfBirth)) {
        return res.status(400).json({ message: 'Invalid dateOfBirth format' });
      }

      const patient = new Patient({
        firstName: patientData.name[0].given[0],
        lastName: patientData.name[0].family,
        dateOfBirth: dateOfBirth,
        gender: patientData.gender,
        fhirResponse: patientData,
      });

      await patient.save();

      res.status(201).json({
        message: 'Patient created successfully',
        patient: patient,
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  // Fetch all FHIR-compliant patient records from the FHIR server
  getAllPatients: async (req, res) => {
    try {
      // Make a GET request to the FHIR server to retrieve all patient records
      const response = await axios.get(`${fhirBaseUrl}/Patient`);

      // Return the array of patient records from the FHIR server
      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve patient records' });
    }
  },

  get: async (req, res) => {
    try {
      const { fhirId } = req.params;

      const response = await axios.get(`${fhirBaseUrl}/Patient/${fhirId}`);

      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve the patient record' });
    }
  },
  // Update a patient record on the FHIR server by ID
  update: async (req, res) => {
    try {
      const { fhirId } = req.params;
      const updatedPatientData = req.body;

      // Make a PUT request to the FHIR server to update the patient record
      const response = await axios.put(`${fhirBaseUrl}/Patient/${fhirId}`, updatedPatientData);

      // Return the response from the FHIR server
      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update the patient record' });
    }
  },

  // Delete a patient record from the FHIR server by ID
  remove: async (req, res) => {
    try {
      const { fhirId } = req.params;
      const response = await axios.delete(`${fhirBaseUrl}/Patient/${fhirId}`);

      if (response.status === 204) {
        res.status(204).json({ message: 'Patient record deleted successfully' });
      } else {
        res.status(404).json({ error: 'Patient record not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete the patient record' });
    }
  }

};




module.exports = { patientController }


