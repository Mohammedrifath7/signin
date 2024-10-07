const express = require("express");
const app = express();
const cors = require("cors");
const collection = require("./mongodb");

// Admin access token
const ADMIN_ACCESS_TOKEN = "123456789"; 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})