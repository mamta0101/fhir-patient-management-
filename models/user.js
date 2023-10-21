const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        //required: [true, 'Please enter your name!'],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter Your email!"],
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Please enter Your phone!"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        // required: [true, "Please enter your Password!"]
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/dda7rejqi/image/upload/v1640185054/unnamed_t8i2or.jpg"
    },



}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)




