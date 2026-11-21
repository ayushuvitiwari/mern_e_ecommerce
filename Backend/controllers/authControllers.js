import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = 'ayushuvitiwari9091@gmail.com';
const ADMIN_PASSWORD = '0016';

// Helper to seed/ensure default Admin exists
const ensureAdminUser = async () => {
    try {
        let admin = await User.findOne({ email: ADMIN_EMAIL });
        if (!admin) {
            const hashPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
            await User.create({
                name: 'Ayush (Admin)',
                email: ADMIN_EMAIL,
                password: hashPassword
            });
            console.log('Default Admin user created successfully.');
        }
    } catch (err) {
        console.error('Error ensuring admin user:', err);
    }
};

// Signup user 
export const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email ? email.toLowerCase().trim() : '';

        // check user already exists 
        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // create user
        const newUser = await User.create({
            name, 
            email: normalizedEmail,
            password: hashPassword,
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Login user 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email ? email.toLowerCase().trim() : '';

        // Check if admin login credentials
        const isAdmin = normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD;

        // Check user in database
        let user = await User.findOne({ email: normalizedEmail });

        // If it is the special admin credentials and not yet saved in DB, create on the fly
        if (isAdmin && !user) {
            const hashPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
            user = await User.create({
                name: 'Ayush (Admin)',
                email: ADMIN_EMAIL,
                password: hashPassword
            });
        }

        if (!user) {
            return res.status(400).json({ message: "User not found with this email" });
        }

        // Compare password (if not already matched via admin bypass)
        if (!isAdmin) {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).json({ message: "Incorrect email or password" });
            }
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: isAdmin ? 'admin' : 'user' },
            process.env.JWT_SECRET || 'MYJWTSECRETKEY123',
            { expiresIn: "7d" }
        );

        res.json({ 
            message: isAdmin ? "Admin Login Successful" : "Login Successful",
            token, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: isAdmin ? 'admin' : 'user'
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
