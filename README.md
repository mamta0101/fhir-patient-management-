# Full Stack Developer Assignment: "FHIR-based Patient Management Dashboard"

Create a simplified Patient Management Dashboard using FHIR standards for healthcare providers to manage patient records. Healthcare providers should be able to perform CRUD (Create, Read, Update, Delete) operations on patient records while adhering to FHIR standards.

## Features
1. **User Authentication:** Implement basic user authentication for healthcare providers using JSON Web Tokens (JWT).

2. **FHIR Patient Records:**
   - **Create:** Add a new patient record following the FHIR standard.
   - **Read:** View existing FHIR-compliant patient records.
   - **Update:** Edit existing FHIR-compliant patient records.
   - **Delete:** Remove FHIR-compliant patient records.

## Technical Requirements
1. **Front-end:**
   - Use ReactJS for the front-end and integrate a FHIR client library to interact with FHIR resources.
   - Login page for authentication.
   - Dashboard page to show a list of patient records.
   - Form to add new patient records that adhere to FHIR standards.
   - Clickable items to view or edit individual FHIR-compliant records.

2. **Back-end:**
   - Use Node.js and Express.js to create FHIR-compliant RESTful API endpoints for CRUD operations.

3. **Database:**
   - Use mongodb database, but you'll also have to convert and store data as FHIR resources.

4. **FHIR Library:**
   - Use a FHIR client library compatible with JavaScript, such as the HAPI FHIR library or FHIR.js, for API interactions.

## build command 
# To start nodejs 
1. npm i 
2. start server #npm start 
# To start fhir server
1. Start Docker
3. docker-compose up
3. docker-compose down

## FHIR Server Setup Instructions
1. Please follow the open-source link: [HAPI FHIR Server Starter](https://github.com/hapifhir/hapi-fhir-jpaserver-starter).

2. Use Docker Compose to run the FHIR server locally. This will run the Docker image with the default configuration, mapping port 8080 from the container to port 8080 on the host. Once running, you can access the HAPI FHIR server's UI at http://localhost:8080/ or use http://localhost:8080/fhir/ as the base URL for your REST requests.

3. Follow the JSON structure for the FHIR patient object [here](https://www.hl7.org/fhir/patient.html).

4. Add a patient record to the FHIR server:
   - POST `http://localhost:8080/fhir/patient` (with JSON in the body).

5. Get a patient record from the FHIR server:
   - GET `http://localhost:8080/fhir/patient/{fhirId}`.

6. Update a patient record on the FHIR server:
   - PUT `http://localhost:8080/fhir/patient/{fhirId}` (with JSON in the body).

6. Delete a patient record on the FHIR server:
   - PUT `http://localhost:8080/fhir/patient/{fhirId}`

## User Experience
1. User opens the portal.
2. Portal asks for email ID & password.
3. New Users should register first and then login.
4. Login successful, will take the user to the dashboard.
5. Dashboard will show a list of patients with their registered time.
6. Each record is clickable to view patient details and even edit details if needed.
7. Portal has an "Add New Record" button to add new patients.
8. Clicking on "Add New Record" displays a form to fill patient details (Demographic details) and a save button to save the records.

## backend deployment link -[https://fhir-patient-management.onrender.com]

## Resources
1. [Fast Healthcare Interoperability Resources (FHIR)](https://en.wikipedia.org/wiki/Fast_Healthcare_Interoperability_Resources)
2. [HL7 FHIR Overview](https://hl7.org/fhir/overview.html)
3. [FHIR.js Library](https://github.com/FHIR/fhir.js/)

