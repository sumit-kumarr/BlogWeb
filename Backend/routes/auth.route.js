import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        if (!clerkUserId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Check if user already exists
        let user = await User.findOne({ clerkUserId });
        if (user) {
            return res.status(200).json({ message: "User already exists", user });
        }

        // Extract user data from Clerk session
        const sessionClaims = req.auth.sessionClaims || {};
        const email = sessionClaims.email || 'no-email';
        
        // Generate a proper username from email
        let username = 'unnamed_user';
        if (email && email !== 'no-email' && email.includes('@')) {
            username = email.split('@')[0];
        } else {
            username = `user_${clerkUserId.slice(-8)}`;
        }

        // Ensure username is unique
        let finalUsername = username;
        let counter = 1;
        while (await User.findOne({ username: finalUsername })) {
            finalUsername = `${username}_${counter}`;
            counter++;
        }

        // Create new user
        user = new User({
            clerkUserId,
            username: finalUsername,
            email: email,
            img: sessionClaims.picture || ''
        });

        await user.save();
        console.log('Created new user:', user);
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error('Error in auth register:', error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

// Add a route to get current user info
router.get('/me', async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        if (!clerkUserId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await User.findOne({ clerkUserId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error getting user info:', error);
        res.status(500).json({ message: "Error getting user info", error: error.message });
    }
});

export default router;
