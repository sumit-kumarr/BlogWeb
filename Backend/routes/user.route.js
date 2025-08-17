import express from 'express';
import { getUserProfile, getAllUsers, updateUserProfile, cleanupUsernames } from '../controller/user.controller.js';

const router = express.Router();

// Get user profile by username
router.get("/profile/:username", getUserProfile);

// Get all users (admin only)
router.get("/all", getAllUsers);

// Update user profile
router.put("/profile", updateUserProfile);

// Clean up usernames (admin only)
router.post("/cleanup-usernames", cleanupUsernames);

// Test endpoint
router.get("/anothertest", (req, res) => {
    res.status(200).send('Another Endpoint');
});

export default router;