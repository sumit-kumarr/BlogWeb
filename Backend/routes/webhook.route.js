import express from 'express';
import { clerkWebhook, cleanupUsernames, fixSpecificUser } from '../controller/webhook.controller.js';
import bodyParser from 'body-parser';


const router = express.Router();
router.post('/clerk', bodyParser.raw({ type: 'application/json' }), clerkWebhook);
router.post('/cleanup-usernames', cleanupUsernames);
router.get('/cleanup-usernames', cleanupUsernames); // Also allow GET for easier testing
router.get('/fix-user/:userId', fixSpecificUser); // Route to fix specific user

export default router;