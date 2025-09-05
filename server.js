const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Dummy Database (replace this with a real database like MySQL or MongoDB)
const users = [];

// Nodemailer transporter setup (Replace with your own email service credentials)
// Example using a Gmail account
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com', // Replace with your email
        pass: 'your_app_password'     // Replace with your app password
    }
});

// --- API Endpoints ---

// 1. Registration Endpoint
app.post('/api/register', async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    // Check if the user already exists
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    try {
        // Generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const newUser = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword,
            isAdmin: false // Set as true for admin users if needed
        };
        users.push(newUser);

        // Send temporary password via email
        const mailOptions = {
            from: 'your_email@gmail.com',
            to: email,
            subject: 'Padel Pro: Your Temporary Password',
            text: `Hi ${name},\n\nYour account has been created. Use this temporary password to sign in: ${tempPassword}\n\nYou will be prompted to reset it after your first login.`
        };
        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Account created! Check your email for a temporary password.' });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// 2. Login Endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    try {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Return user data (without the password hash)
        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        };

        res.status(200).json({ message: 'Login successful!', user: userWithoutPassword });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// 3. Forgot Password Endpoint
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: 'Email address not found.' });
    }

    try {
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        user.password = hashedPassword; // Update the user's password in the dummy db

        const mailOptions = {
            from: 'your_email@gmail.com',
            to: email,
            subject: 'Padel Pro: Temporary Password Reset',
            text: `Hi ${user.name},\n\nYour temporary password is: ${tempPassword}\n\nUse this to sign in. You will be prompted to reset it.`
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Temporary password sent to your email.' });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});