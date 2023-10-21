require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
    useTempFiles: true
}));

mongoose.set("strictPopulate", false)
mongoose.set('strictQuery', true);

// Connect to MongoDB
const uri = process.env.MONGODB_URI;
mongoose.connect(uri || "mongodb+srv://mamtabisht0522:SmDsXepwR6fnfDhd@cluster0.iz5hgyc.mongodb.net/FHIR-Patient-Management", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('MongoDB connection error:', error);
    });

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome To FHIR-based Patient Management Test Server' });
});

app.use('/', require('./routes/user'))
app.use('/', require('./routes/patient'))


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on Port Number: ${PORT}`);
});
