import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure dotenv with override option
dotenv.config({ 
  path: join(__dirname, '.env'),
  override: true 
});

// Debug environment variables
console.log('ImageKit Config:', {
  endpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_URL_PUBLIC_KEY ? 'Found' : 'Missing',
  privateKey: process.env.IK_URL_PRIVATE_KEY ? 'Found' : 'Missing'
});

import express from 'express';
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import commentRouter from './routes/comment.route.js';
import authRouter from './routes/auth.route.js';
import connectDB from './lib/connectDB.js';
import webhookRouter from './routes/webhook.route.js';
import { clerkMiddleware } from '@clerk/express';
import cors from "cors"


// Log configuration status
console.log('Configuration Status:');
console.log('- Clerk Keys:', process.env.CLERK_PUBLISHABLE_KEY ? 'Found' : 'Using defaults');
console.log('- ImageKit Keys:', process.env.IK_URL_ENDPOINT ? 'Found' : 'Using defaults');
console.log('- MongoDB URI:', process.env.MONGO_URI ? 'Found' : 'Using defaults');

const app = express();
// Mount webhook routes BEFORE express.json so the raw body is available to the verifier
app.use('/webhooks', webhookRouter);
app.use(express.json());
app.use(cors({
  origin: 'https://shareyourthoughts-iesp.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY
}));

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    config: {
      clerkKeys: !!process.env.CLERK_PUBLISHABLE_KEY,
      imagekitKeys: !!process.env.IK_URL_ENDPOINT,
      mongodbUri: !!process.env.MONGODB_URI
    }
  });
});

app.get('/test-comment', async (req, res) => {
  try {
    const Comment = (await import('./models/comment.model.js')).default;
    const count = await Comment.countDocuments();
    res.json({ 
      message: 'Comment test successful',
      commentCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Comment test failed',
      error: error.message 
    });
  }
});

// app.get("/auth-state", (req,res) => {
// const authState = req.auth;
// res.json(authState)
// })


app.get("/protect", (req,res) => {
const {userId}= req.auth;
if(!userId){
  return res.status(400).json("Not Authenticated")
}
res.status(200).json("content")
})

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use((error,req,res,next) => {

  res.status(error.status || 500);
  res.json({
    message:error.message || "something went wrong!",
    status:error.status || 500,
    stack:error.stack,
  })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log('Connected to MongoDB');
    console.log(`Server is running on port ${PORT}`);
});

