const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require('nodemailer');

// Import your custom packages
const {
    teaourworldtalkproject,
    codecraftersMytea,
    tyzcybercraft,
    quantumcraftTea,
    smarttaskTea,
    healthfitTea,
    datainsightTea,
    taskmasterTea,
    recipegenieTea,
    smarthomehubsmarthomehubTea,
    ecogardenTea,
    codecrafterstea,
    dataanalyzerourTea,
    ecotravelourTea,
    ecoeatstea,
    healthmonitortea,
    ecotrackTea,
    securevaultTea,
    codegeniusTea
} = require('./your-custom-packages');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/codepulse', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Define User model
const User = require('./models/User');

// Define routes
app.get('/', (req, res) => {
    res.send('Welcome to CodePulse!');
});

// Route to register a new user
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
