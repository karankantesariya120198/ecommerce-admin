const fs = require('fs');
const path = require('path');
const { encrypt, decrypt } = require('../services/cryptoService');
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig, refreshToken } = require('../config/config');
const { readData, writeData } = require('../utils/fileHelper'); // Assuming you have a utility to read files
const { v4: uuidv4 } = require('uuid');

const USERS_FILE = 'users.json'; // Assuming you have a User model defined 
const JWT_EXPIRATION = '1h'; // Token expiration time
const JWT_SECRET = process.env.JWT_SECRET // Use a secure secret in production;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

const validateSignup = (data) => {
    const errors = {};

    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.email = "Valid email is required";
    }

    if (!data.password || data.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }
    
    if (data.password !== data.confirm) {
        errors.confirm = "Passwords do not match";
    }
    
    if (!data.nickname || data.nickname.trim().length < 2) {
        errors.nickname = "Nickname must be at least 2 characters";
    }
    
    const phoneNumber = `${data.prefix || ''}${data.phone}`;
    if (!phoneNumber || !/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
        errors.phone = "Valid phone number required";
    }
    
    if (!data.intro || data.intro.trim().length < 10) {
        errors.intro = "Introduction must be at least 10 characters";
    }
    
    if (!data.gender || !['male', 'female', 'other'].includes(data.gender)) {
        errors.gender = "Valid gender selection required";
    }
    
    if (!data.agreement) {
        errors.agreement = "You must accept the agreement";
    }
    
    return errors;
}

const validateLogin = (data) => {
    const errors = {};
    
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.email = "Valid email is required";
    }
    
    if (!data.password) {
        errors.password = "Password is required";
    }
    
    return errors;
};

exports.generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    );

    return accessToken;
}

// Controller for user signup
exports.signup = async (req, res) => {
    try {
        const { email, password, confirm, nickname, phone, intro, gender, agreement, prefix } = req.body;

        const errors = validateSignup(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        const users = readData(USERS_FILE) || [];
        if (users.length > 0) {
            // Check if email is already registered
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                return res.status(409).json({ error: 'User already exists. Please try a different email.' });
            }
        }

        const { encryptedData, iv } = encrypt(password);
        users.push({
            id: uuidv4(),
            email: email,
            password: encryptedData,
            iv: iv,
            nickname: nickname,
            phone: `${prefix || ""}${phone}`,
            intro: intro,
            gender: gender,
            agreement: agreement,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()  
        });

        // Save user data to USERS_FILE
        writeData(USERS_FILE, users);
        res.status(201).json({ 
            message: 'User registered successfully',
            user: users[users.length - 1] // Return the newly created user 
        });
    } catch (error) {
        console.error("Signup error:", error.stack);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const errors = validateLogin(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }
    
        let users = readData(USERS_FILE) || [];
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(409).json({ error: 'No users found. Please register first.' });
        }

        const decryptedPassword = decrypt(user.password, user.iv);
        if (decryptedPassword !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = exports.generateTokens(user);

        // Successful login
        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                email: user.email,
                nickname: user.nickname,
                phone: user.phone,
                intro: user.intro,
                gender: user.gender,
                agreement: user.agreement
            }
        });
    } catch (error) {
        console.error("Login error:", error.stack);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};
