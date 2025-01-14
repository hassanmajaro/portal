const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const  { User } = require('../models/db'); // Adjust path if necessary
const { sendActivationEmail } = require('../services/emailServices'); // Email service function

const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register user
exports.register = async (req, res) => {
    const { surname, first_name, middle_name, gender, course_applied_for, email, password, confirmPassword } = req.body;

    try {
        // Step 1: Validate Email
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        // Step 2: Validate Password Match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        // Step 3: Check if User Already Exists
        const existingUser = await User.findOne({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Step 4: Hash the Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Step 5: Generate Verification Code
        const verificationCode = generateVerificationCode();

        // Step 6: Create New User
        const newUser = await User.create({
            surname,
            first_name,  // Matches the updated field name in your User model
            middle_name, // Matches the updated field name in your User model
            gender,
            course_applied_for,
            email,
            password: hashedPassword,  // Save the hashed password
            verification_code: verificationCode, // This corresponds with your User model
        });

        // Step 7: Send Activation Email
        await sendActivationEmail(email, verificationCode);

        // Step 8: Return Success Response
        return res.status(201).json({
            message: 'Registration successful! Check your email to activate your account.',
            user: {
                id: newUser.user_id,
                surname: newUser.surname,
                middle_name: newUser.middle_name,
                email: newUser.email,
                gender: newUser.gender,
                course_applied_for: newUser.course_applied_for,
                password: newUser.password
            },
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).json({ message: 'Error registering user.', error: error.message });
    }
};

// Login user
// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Step 1: Validate Email
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        // Step 2: Find User by Email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Step 3: Check if the Account is Verified
        if (!user.is_verified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        // Step 4: Compare Passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Step 5: Generate JWT Token
        const token = jwt.sign(
            { userId: user.user_id, email: user.email, role: user.role },
            process.env.JWT_SECRET, // Ensure you have a secret key in your environment variables
            { expiresIn: '1h' } // Token expiration time
        );

        // Step 6: Return Success Response with Token
        return res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user.user_id,
                surname: user.surname,
                middle_name: user.middle_name,
                email: user.email,
                gender: user.gender,
                course_applied_for: user.course_applied_for,
                password: user.password
            },
        });
    } catch (error) {
        console.error('Error during user login:', error);
        return res.status(500).json({ message: 'Error logging in.', error: error.message });
    }
};

// Verify user email
exports.verifyEmail = async (req, res) => {
    const { verification_code } = req.body;

    try {
        // Step 1: Find the user by email and verification code
        const user = await User.findOne({
            where: {
                verification_code,
            },
        });

        // Step 2: Check if user exists and verification code matches
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or verification code.' });
        }

        // Step 3: Check if user is already verified
        if (user.is_verified) {
            return res.status(400).json({ message: 'User is already verified.' });
        }

        // Step 4: Update user to set as verified
        user.is_verified = true;
        user.verification_code = null; // Clear the verification code
        await user.save();

        // Step 5: Return success response
        return res.status(200).json({
            message: 'Email verified successfully! Your account is now active.',
        });
    } catch (error) {
        console.error('Error during email verification:', error);
        return res.status(500).json({ message: 'Error verifying email.', error: error.message });
    }
};


