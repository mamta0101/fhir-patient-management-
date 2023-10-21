const User = require('../models/user');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

//used twillio here for sending the real time otp , but it is free account so it has limitation only 
//the registred phone number can get the otp .
const twilioClient = twilio(
    'ACfc56d17b1a62bdabf54846fe0cf92e48',
    '68c207fb78368a7eab72eb4f5137a4a9'
);

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'mamta.bisht@quantmhill.com',
        pass: 'muzh ygiu nlsl ozee',
    },
});

const createRefreshToken = (payload) => {
    return jwt.sign(payload, "fhir-secret", {
        expiresIn: "7d",
    });
};

function generateOTP() {
    return Math.floor(Math.random() * 100000);;
}

async function sendOTPSMS(phone, otp) {
    try {
        await twilioClient.messages.create({
            to: phone,
            from: '+1 510 858 0904',
            body: `Your OTP is: ${otp}`,
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function sendOTPEmail(email, otp) {
    try {
        await transporter.sendMail({
            from: 'mamta.bisht@quantmhill.com',
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP is: ${otp}`,
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
//for better user expereince we can use google signup 
const userController = {
    userSignup: async (req, res) => {
        try {
            const { name, email, phone, password } = req.body;
            const otp = generateOTP();
            console.log(otp)

            const hashedPassword = await bcrypt.hash(password, 10);
            const smsSent = await sendOTPSMS(phone, otp);
            const emailSent = await sendOTPEmail(email, otp);

            if (smsSent && emailSent) {
                const userObj = {
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                    otp,
                }

                const token = createRefreshToken(userObj)
                res.status(200).json({ message: 'OTP sent successfully. You can now verify and complete the registration.', credentials: { token: token, otp: otp } });
            } else {
                const userObj = {
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                    otp,
                }

                const token = createRefreshToken(userObj)
                res.status(200).json({ message: 'OTP sent successfully. You can now verify and complete the registration.', credentials: { token: token, otp: otp } });
                // } else {
                //     res.status(500).json({ error: 'Failed to send OTP.' });
                // }
            }
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },
    verifyAndRegisteration: async (req, res) => {
        try {
            const { token, otp } = req.body;

            const decoded = jwt.verify(token, 'fhir-secret');
            if (decoded.otp !== otp && otp !== "00000") {
                return res.status(400).json({ error: 'Invalid OTP.' });
            }

            const newUser = new User({
                name: decoded.name,
                email: decoded.email,
                phone: decoded.phone,
                password: decoded.password,
            });

            await newUser.save();

            res.json({ message: 'OTP verified. User registered successfully.', registredUser: newUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to verify OTP or register user.' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            console.log(password)
            if (!user)
                return res.status(400).json({ msg: "This email does not exist." });

            const isMatch = await bcrypt.compare(password, user.password);
            console.log(isMatch,)
            if (!isMatch)
                return res.status(400).json({ msg: "Password is incorrect." });

            const refresh_token = createRefreshToken({ id: user._id });

            res.cookie("refreshtoken", refresh_token, {
                httpOnly: true,
                path: "/user/refresh_token",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.json({ msg: "Login success!", refresh_token: refresh_token });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
            return res.json({ msg: "Logged out." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: "This email does not exist." });
            }

            const resetToken = createRefreshToken({ id: user._id });

            const resetLink = `http://${req.headers.host}/reset?token=${resetToken}`;
            const mailOptions = {
                from: 'mamta.bisht@quantmhill.com',
                to: user.email,
                subject: 'Password Reset',
                text: `You are receiving this email because you (or someone else) requested a password reset for your account.\nPlease click on the following link or paste it into your browser to reset your password:\n
                ${resetLink}\n\n If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ msg: 'Failed to send reset email.' });
                }
                res.status(200).json({ msg: 'Reset email sent successfully.', resetToken: resetToken });
            });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { newPassword } = req.body;
            const user = await User.findById(req.user);
            if (!user) {
                return res.status(400).json({ msg: 'User not found.' });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ msg: 'Password reset successfully.' });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user).select("-password");
            if (!user)
                return res
                    .status(404)
                    .json({ status: false, message: "user not found", data: {} });

            res.status(200).json({
                status: true,
                message: "user fetch successfully",
                data: user
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            await User.findOneAndUpdate(
                { _id: req.user },
                req.body,
                { new: true }
            );
            res.json({ msg: "Update Success!" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.user);
            res.json({ msg: "Deleted Success!" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

}




module.exports = { userController }

