import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { Webhook } from "svix";

// Utility function to generate a proper username
const generateUsername = async (email, existingUsername = null, clerkUserId = null) => {
  let username = existingUsername;
  
  // If username is invalid or missing, try to generate from email
  if (!username || username.trim() === '' || username.includes('@') || username === 'unnamed_user' || username === 'no-email') {
    if (email && email !== 'no-email' && email.includes('@')) {
      username = email.split('@')[0]; // Use part before @ as username
    } else {
      // If no valid email, generate from clerkUserId
      username = `user_${clerkUserId ? clerkUserId.slice(-8) : Math.random().toString(36).substr(2, 8)}`;
    }
  }
  
  // Ensure username is unique by adding a random suffix if needed
  let finalUsername = username;
  let counter = 1;
  while (await User.findOne({ username: finalUsername })) {
    finalUsername = `${username}_${counter}`;
    counter++;
  }
  
  return finalUsername;
};

export const clerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Webhook secret needed!");
  }

  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;
  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    res.status(400).json({
      message: "Webhook verification failed!",
    });
    return; // Stop further processing if verification fails
  }

  // console.log(evt.data);

  if (evt.type === "user.created") {
    try {
      // Handle cases where email might be missing or invalid
      let email = 'no-email';
      if (evt.data.email_addresses && evt.data.email_addresses.length > 0) {
        email = evt.data.email_addresses[0].email_address;
      }
      
      const finalUsername = await generateUsername(email, evt.data.username, evt.data.id);

      console.log(`Creating user with username: ${finalUsername}, email: ${email}`);

      const newUser = new User({
        clerkUserId: evt.data.id,
        username: finalUsername,
        email: email,
        img: evt.data.profile_img_url,
      });

      await newUser.save();
      console.log(`Successfully created user: ${finalUsername}`);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  if (evt.type === "user.deleted") {
    const deletedUser = await User.findOneAndDelete({
      clerkUserId: evt.data.id,
    });

    await Post.deleteMany({user:deletedUser._id})
    await Comment.deleteMany({user:deletedUser._id})
  }

  return res.status(200).json({
    message: "Webhook received",
  });
};

// Function to clean up existing users with improper usernames
export const cleanupUsernames = async (req, res) => {
  try {
    const users = await User.find({});
    let updatedCount = 0;
    
    for (const user of users) {
      // Check if username needs to be updated
      if (!user.username || 
          user.username.trim() === '' || 
          user.username.includes('@') || 
          user.username === 'unnamed_user' ||
          user.username === 'Unknown User' ||
          user.username === 'no-email') {
        
        const newUsername = await generateUsername(user.email, user.username, user.clerkUserId);
        await User.findByIdAndUpdate(user._id, { username: newUsername });
        updatedCount++;
        console.log(`Updated username for user ${user.email} to ${newUsername}`);
      }
    }
    
    res.status(200).json({
      message: `Successfully updated ${updatedCount} usernames`,
      updatedCount
    });
  } catch (error) {
    console.error('Error cleaning up usernames:', error);
    res.status(500).json({
      message: 'Error cleaning up usernames',
      error: error.message
    });
  }
};

// Function to fix a specific user by ID
export const fixSpecificUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const newUsername = await generateUsername(user.email, user.username, user.clerkUserId);
    await User.findByIdAndUpdate(user._id, { username: newUsername });
    
    console.log(`Fixed username for user ${user.email} to ${newUsername}`);
    
    res.status(200).json({
      message: `Successfully updated username to ${newUsername}`,
      oldUsername: user.username,
      newUsername
    });
  } catch (error) {
    console.error('Error fixing specific user:', error);
    res.status(500).json({
      message: 'Error fixing specific user',
      error: error.message
    });
  }
};