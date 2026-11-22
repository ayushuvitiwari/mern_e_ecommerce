import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/mail.js';

const ADMIN_EMAIL = 'ayushuvitiwari9091@gmail.com';
const ADMIN_PASSWORD = '0016';


// Ensure default Admin exists in database
export const ensureAdminUser = async () => {
    try {
        let admin = await User.findOne({ email: ADMIN_EMAIL });
        if (!admin) {
            const hashPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
            await User.create({
                name: 'Ayush (Admin)',
                email: ADMIN_EMAIL,
                password: hashPassword,
                role: 'admin'
            });

            safeSendMail({
                from: process.env.Email || 'ayushuvitiwari9091@gmail.com',
                to: process.env.Email,
                subject: 'Admin Login Successful - Ayush Store 🔐',
                text: `Dear Admin, \n You have successfully logged in to Ayush Store Admin Panel. \n Your admin account is now active. You can manage products, customers, orders and store activities. \n Thank you, \n Ayush Store Team`
            });

            console.log('Default Admin user created successfully.');
        }
    } catch (err) {
        console.error('Error ensuring admin user:', err.message);
    }
};

// Signup user 
export const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all required fields" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists 
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashPassword,
            role: normalizedEmail === ADMIN_EMAIL ? 'admin' : 'user'
        });

        // Send welcome email asynchronously without blocking signup
        safeSendMail({
            from: `"Ayush Store" <${process.env.Email}>` || 'ayushuvitiwari9091@gmail.com',
            to: normalizedEmail,
            subject: "Welcome to Ayush Store! 🎉",
            text: `Dear ${name},\n\nWelcome to Ayush Store! Thank you for signing up with us.\nNow you can explore our products and enjoy shopping.\n\nHappy Shopping!\nBest Regards,\nAyush Store Team`
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};

// Login user 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const isAdmin = normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD;

        // Check user in database
        let user = await User.findOne({ email: normalizedEmail });

        // If admin logs in with fixed 0016 password and record doesn't exist yet, create it
        if (isAdmin && !user) {
            const hashPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
            user = await User.create({
                name: 'Ayush (Admin)',
                email: ADMIN_EMAIL,
                password: hashPassword,
                role: 'admin'
            });
        }

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Verify password
        if (!isAdmin) {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).json({ message: "Invalid email or password" });
            }
        }

        const role = isAdmin || user.role === 'admin' ? 'admin' : 'user';

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role },
            process.env.JWT_SECRET || 'MYJWTSECRETKEY123',
            { expiresIn: "7d" }
        );

        // Send login notification mail asynchronously without blocking login
        safeSendMail({
            from: `"Ayush Store" <${process.env.Email}>` || 'ayushuvitiwari9091@gmail.com',
            to: normalizedEmail,
            subject: 'Welcome Back to Ayush Store! 🛍️',
            text: `Dear ${user.name},\n\nYou have successfully logged in to your Ayush Store account.\nExplore our latest products and enjoy your shopping experience.\n\nBest Regards,\nAyush Store Team`
        });

        res.json({
            message: role === 'admin' ? "Admin Login Successful" : "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
};
