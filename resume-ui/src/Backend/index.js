const express = require("express");
const app = express();
const cors = require("cors");
const collection = require("./mongodb");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Admin access token
const ADMIN_ACCESS_TOKEN = "123456789"; 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Nodemailer setup
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'rifathjainulla12345@gmail.com', // Replace with your email
        pass: 'rifath_12345'   // Replace with your email password or app-specific password
    }
});

// Signup API
app.post('/signup', async (req, res) => {
    const { name, password, email, role, accessToken } = req.body;

    try {
        // If the role is 'admin', check the access token
        if (role === 'admin') {
            if (accessToken !== ADMIN_ACCESS_TOKEN) {
                return res.status(401).json({ message: "Invalid admin access token. Cannot create admin account." });
            }
        }

        // Save user details to the database
        const data = { name, password, email, role };
        await collection.insertMany([data]);
        res.status(200).json({ message: "Signup successful" });
    } catch (error) {
        res.status(500).json({ message: "Error signing up" });
    }
});

// Login API
app.post('/login', async (req, res) => {
    const { nameOrEmail, password } = req.body;

    try {
        // Find the user by either name or email
        const check = await collection.findOne({
            $or: [{ name: nameOrEmail }, { email: nameOrEmail }]
        });

        // Validate password and login
        if (check && check.password === password) {
            res.status(200).json({ message: "Login successful", role: check.role });
        } else {
            res.status(401).json({ message: "Invalid login details" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});

// Forgot Password API
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await collection.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = crypto.randomBytes(20).toString('hex');

        // Save the token to the user's record
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const mailOptions = {
            to: user.email,
            from: 'rifathjainulla12345@gmail.com', // Replace with your email
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   http://localhost:3000/reset-password/${token}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('There was an error: ', err);
                res.status(500).json({ message: 'Error sending email' });
            } else {
                res.status(200).json({ message: 'Password reset instructions sent to your email' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error sending email" });
    }
});

// Reset Password API
app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await collection.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired" });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password has been reset" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});